'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import { sampleUsers, getAllEvents, getAllReviews, Event, Review, getCurrentUser } from '@/lib/sampleData'
import { 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  ShareIcon,
  HeartIcon,
  GlobeAltIcon,
  LockClosedIcon,
  StarIcon,
  FlagIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ListBulletIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

// Enhanced events data for discovery - Real Phoenix locations
const mapboxEvents = [
  {
    id: '1',
    title: 'JavaScript Workshop',
    description: 'Learn React hooks and state management',
    date: 'Tonight',
    time: '7:00 PM',
    location: 'Galvanize Phoenix',
    address: '515 E Grant St, Phoenix, AZ 85004',
    category: 'tech',
    eventType: 'public',
    attendeeCount: 24,
    maxAttendees: 30,
    trustScore: 87,
    distance: 0.3,
    coordinates: [-112.0636, 33.4484],
    status: 'open',
    price: 0,
    hostId: '2',
    journeyTiming: 60
  },
  {
    id: '2',
    title: 'Coffee & Code',
    description: 'Perfect transition between events',
    date: 'Tonight',
    time: '8:30 PM',
    location: 'Lux Coffee Bar',
    address: '4404 N Central Ave, Phoenix, AZ 85012',
    category: 'social',
    eventType: 'private',
    attendeeCount: 8,
    maxAttendees: 15,
    trustScore: 84,
    distance: 2.1,
    coordinates: [-112.0730, 33.4908],
    status: 'open',
    price: 5,
    hostId: '3',
    journeyTiming: 30
  },
  {
    id: '3',
    title: 'Art Gallery Opening',
    description: 'Local artists showcase with wine',
    date: 'Tonight',
    time: '9:00 PM',
    location: 'Phoenix Art Museum',
    address: '1625 N Central Ave, Phoenix, AZ 85004',
    category: 'arts',
    eventType: 'public',
    attendeeCount: 15,
    maxAttendees: 20,
    trustScore: 92,
    distance: 1.8,
    coordinates: [-112.0640, 33.4670],
    status: 'open',
    price: 15,
    hostId: '4',
    journeyTiming: 120
  },
  {
    id: '4',
    title: 'Rooftop Social',
    description: 'End the night with city views',
    date: 'Tonight',
    time: '10:30 PM',
    location: 'Found:RE Phoenix',
    address: '1100 N Central Ave, Phoenix, AZ 85004',
    category: 'social',
    eventType: 'public',
    attendeeCount: 32,
    maxAttendees: 50,
    trustScore: 89,
    distance: 1.2,
    coordinates: [-112.0740, 33.4592],
    status: 'open',
    price: 12,
    hostId: '5',
    journeyTiming: 90
  },
  {
    id: '5',
    title: 'Desert Hiking Adventure',
    description: 'Beautiful sunrise hike with experienced group',
    date: 'Tomorrow',
    time: '6:00 AM',
    location: 'South Mountain Park',
    address: '10919 S Central Ave, Phoenix, AZ 85042',
    category: 'adventure',
    eventType: 'public',
    attendeeCount: 15,
    maxAttendees: 25,
    trustScore: 92,
    distance: 8.2,
    coordinates: [-112.0858, 33.3930],
    status: 'open',
    price: 0,
    hostId: '6',
    journeyTiming: 240
  },
  {
    id: '6',
    title: 'Private Wine Tasting',
    description: 'Exclusive tasting with sommelier',
    date: 'Tonight',
    time: '8:00 PM',
    location: 'The Arrogant Butcher',
    address: '2 E Jefferson St, Phoenix, AZ 85004',
    category: 'food',
    eventType: 'private',
    attendeeCount: 8,
    maxAttendees: 12,
    trustScore: 95,
    distance: 0.5,
    coordinates: [-112.0740, 33.4478],
    status: 'open',
    price: 45,
    hostId: '7',
    journeyTiming: 90
  },
  {
    id: '7',
    title: 'Suns Game Watch Party',
    description: 'Watch the Phoenix Suns with fellow fans',
    date: 'Tonight',
    time: '7:30 PM',
    location: 'Footprint Center',
    address: '201 E Jefferson St, Phoenix, AZ 85004',
    category: 'sports',
    eventType: 'public',
    attendeeCount: 45,
    maxAttendees: 60,
    trustScore: 88,
    distance: 0.4,
    coordinates: [-112.0712, 33.4458],
    status: 'open',
    price: 25,
    hostId: '8',
    journeyTiming: 180
  },
  {
    id: '8',
    title: 'Startup Pitch Night',
    description: 'Local entrepreneurs present their ideas',
    date: 'Tonight',
    time: '6:30 PM',
    location: 'Arizona Science Center',
    address: '600 E Washington St, Phoenix, AZ 85004',
    category: 'professional',
    eventType: 'public',
    attendeeCount: 35,
    maxAttendees: 50,
    trustScore: 91,
    distance: 0.6,
    coordinates: [-112.0664, 33.4484],
    status: 'open',
    price: 10,
    hostId: '9',
    journeyTiming: 120
  }
]

// User location: 400 E. Van Buren St., Ste. 600, Phoenix, 85004
const USER_LOCATION = {
  coordinates: [-112.0664, 33.4449] as [number, number],
  address: '400 E. Van Buren St., Ste. 600, Phoenix, AZ 85004'
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'discover'>('upcoming')
  const [likedEvents, setLikedEvents] = useState<{[key: string]: boolean}>({})
  const [events, setEvents] = useState<Event[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [flagModal, setFlagModal] = useState<{
    isOpen: boolean
    contentType: 'post' | 'event' | 'social'
    contentId: string
    contentTitle?: string
  }>({
    isOpen: false,
    contentType: 'event',
    contentId: '',
    contentTitle: ''
  })
  
  // Discovery states
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0)
  const [journey, setJourney] = useState<any[]>([])
  const [maybeEvents, setMaybeEvents] = useState<any[]>([])
  const [notifyEvents, setNotifyEvents] = useState<any[]>([])
  const [skippedEvents, setSkippedEvents] = useState<string[]>([])
  const [swipeStats, setSwipeStats] = useState({ viewed: 0, liked: 0, maybe: 0, notify: 0 })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [exploreMode, setExploreMode] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchAddress, setSearchAddress] = useState('')
  const [showAddressSearch, setShowAddressSearch] = useState(false)
  
  const [filters, setFilters] = useState({
    distance: 'All',
    category: '',
    time: 'All',
    trustLevel: 'All'
  })

  // Add active category filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('')

  // Filter events based on active category
  const getFilteredEvents = () => {
    if (!activeCategoryFilter) return mapboxEvents
    return mapboxEvents.filter(event => event.category === activeCategoryFilter)
  }

  // Load events, reviews and current user on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allEvents, allReviews, user] = await Promise.all([
          getAllEvents(),
          getAllReviews(),
          getCurrentUser()
        ])
        
        setEvents(allEvents)
        setReviews(allReviews) 
        setCurrentUser(user)

        // Parse URL for journey restoration
        const params = new URLSearchParams(window.location.search)
        const journeyParam = params.get('journey')
        if (journeyParam) {
          try {
            const journeyData = JSON.parse(decodeURIComponent(journeyParam))
            loadJourney(journeyData)
          } catch (error) {
            console.error('Error parsing journey parameter:', error)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  // Initialize Mapbox when discover tab is active
  useEffect(() => {
    if (activeTab === 'discover' && mapContainer.current && !mapLoaded) {
      initializeMapbox()
    }
  }, [activeTab, mapLoaded])

  // Update markers when map loads or journey changes
  useEffect(() => {
    if (mapLoaded) {
      addEventMarkers()
    }
  }, [mapLoaded, journey, maybeEvents, currentSwipeIndex, activeCategoryFilter])

  const initializeMapbox = async () => {
    try {
      if (!mapContainer.current) return

      // Clear any existing map first
      if (map.current) {
        map.current.remove()
        map.current = null
      }

      const mapboxgl = (await import('mapbox-gl')).default
      
      // Mapbox token
      const accessToken = 'pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw'
      mapboxgl.accessToken = accessToken

      // Fixed Phoenix coordinates for map center
      const phoenixCenter: [number, number] = [-112.0664, 33.4449] // Same as user location

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: phoenixCenter,
        zoom: 13,
        attributionControl: false
      })

      map.current.on('load', () => {
                  // Map loaded successfully
        setMapLoaded(true)
        addEventMarkers()
      })

      // Add error handling
      map.current.on('error', (e: any) => {
        console.error('Map error:', e)
      })

    } catch (error) {
      console.error('Error loading Mapbox:', error)
    }
  }

  // Store markers to clear them later
  const markersRef = useRef<any[]>([])
  const routeLayerRef = useRef<string[]>([])

  const addEventMarkers = () => {
    if (!map.current || !mapLoaded) return
    
    // Clear ALL existing markers completely - this prevents accumulation
    markersRef.current.forEach(marker => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove()
      }
    })
    markersRef.current = []
    
    // Clear existing route layers
    routeLayerRef.current.forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId)
      }
      if (map.current?.getSource(layerId)) {
        map.current.removeSource(layerId)
      }
    })
    routeLayerRef.current = []
    
    // Import mapbox fresh each time to avoid reference issues
    const addMarkers = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      
      // Process each event with PROPER coordinate precision handling
      getFilteredEvents().forEach((event, index) => {
        // CRITICAL: Mapbox coordinate precision - round to 6 decimal places (~10cm accuracy)
        // This prevents floating-point drift that causes pin misalignment
        const originalLng = Number(event.coordinates[0])
        const originalLat = Number(event.coordinates[1])
        
        // Validate coordinates first
        if (!Number.isFinite(originalLng) || !Number.isFinite(originalLat)) {
          console.error(`Invalid coordinates for event ${event.id}:`, event.coordinates)
          return
        }
        
        // Apply standard 6-decimal precision for geographic stability
        const lng = Math.round(originalLng * 1000000) / 1000000
        const lat = Math.round(originalLat * 1000000) / 1000000
        
        // Create marker element with consistent styling
        const el = document.createElement('div')
        el.className = 'map-pin'
        
        // Enhanced styling for better map locking visual feedback
        const baseSize = 44
        el.style.cssText = `
          width: ${baseSize}px;
          height: ${baseSize}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          color: white;
          transition: all 0.2s ease;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          z-index: 10;
        `
        
        // Color coding: Blue for public, Red for private (higher contrast)
        if (event.eventType === 'public') {
          el.style.backgroundColor = '#2563eb' // blue-600
          el.style.borderColor = '#dbeafe' // blue-50
        } else {
          el.style.backgroundColor = '#dc2626' // red-600
          el.style.borderColor = '#fef2f2' // red-50
        }
        
        // Check status and apply visual indicators
        const journeyEvent = journey.find(j => j.id === event.id)
        const isConfirmed = journeyEvent?.status === 'confirmed'
        const isCurrentlyViewing = index === currentSwipeIndex
        
        // Status-based styling
        if (isConfirmed) {
          el.style.transform = 'translateZ(0) scale(1.15)'
          el.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.5), 0 6px 16px rgba(0, 0, 0, 0.15)'
          el.style.zIndex = '20'
        }
        
        if (isCurrentlyViewing) {
          el.style.boxShadow = '0 0 0 6px rgba(251, 191, 36, 0.7), 0 6px 16px rgba(0, 0, 0, 0.15)'
          el.style.animation = 'pulse 2s infinite'
          el.style.zIndex = '30'
        }
        
        // Set icon content
        el.innerHTML = getEventIcon(event.category)
        
        // Maybe status overlay
        if (journeyEvent?.status === 'maybe') {
          const overlay = document.createElement('div')
          overlay.style.cssText = `
            position: absolute;
            top: -6px;
            right: -6px;
            width: 22px;
            height: 22px;
            background-color: #fbbf24;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            z-index: 1;
          `
          overlay.innerHTML = '❓'
          el.appendChild(overlay)
        }
        
        // Click handler for map interaction
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          setCurrentSwipeIndex(index)
          
          // Smooth map movement to pin
          if (map.current) {
            map.current.flyTo({
              center: [lng, lat], // Use the precise coordinates
              zoom: Math.max(15, map.current.getZoom()),
              duration: 800,
              essential: true
            })
          }
        })

        // CREATE MARKER with PROPER Mapbox configuration for coordinate locking
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center', // Critical: Anchor pin exactly at coordinate center
          offset: [0, 0], // No pixel offset to maintain geographic precision
          // These settings ensure proper map projection locking:
          pitchAlignment: 'map', // Align with map plane for geographic consistency
          rotationAlignment: 'map' // Maintain orientation with map rotation
        })
        .setLngLat([lng, lat]) // Use precise coordinates
        .addTo(map.current!)
        
        // Store reference for cleanup and debugging
        ;(marker as any)._eventId = event.id
        ;(marker as any)._originalCoords = [originalLng, originalLat]
        ;(marker as any)._preciseCoords = [lng, lat]
        markersRef.current.push(marker)
      })
      
      // Add user location marker with same precision approach
      const userLng = Math.round(Number(USER_LOCATION.coordinates[0]) * 1000000) / 1000000
      const userLat = Math.round(Number(USER_LOCATION.coordinates[1]) * 1000000) / 1000000
      
      const userEl = document.createElement('div')
      userEl.style.cssText = `
        width: 28px;
        height: 28px;
        background-color: #16a34a;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        transform: translateZ(0);
      `
      
      // Ping animation for user location
      const ping = document.createElement('div')
      ping.style.cssText = `
        position: absolute;
        width: 28px;
        height: 28px;
        background-color: #16a34a;
        border-radius: 50%;
        opacity: 0.75;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      `
      userEl.appendChild(ping)
      
      const dot = document.createElement('div')
      dot.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: #16a34a;
        border-radius: 50%;
        position: relative;
        z-index: 10;
      `
      userEl.appendChild(dot)
      
      const userMarker = new mapboxgl.Marker({
        element: userEl,
        anchor: 'center',
        offset: [0, 0],
        pitchAlignment: 'map',
        rotationAlignment: 'map'
      })
      .setLngLat([userLng, userLat])
      .addTo(map.current!)
      
      markersRef.current.push(userMarker)

      // Add journey routes if multiple events
      if (journey.length > 1) {
        addJourneyRoutes()
      }
    }
    
    // Execute marker addition with error handling
    addMarkers().catch(error => {
      console.error('Error adding markers:', error)
    })
  }

  const addJourneyRoutes = async () => {
    if (!map.current || journey.length < 2) return

    try {
      for (let i = 0; i < journey.length - 1; i++) {
        const startEvent = journey[i]
        const endEvent = journey[i + 1]
        
        const startCoords = [startEvent.coordinates[0], startEvent.coordinates[1]]
        const endCoords = [endEvent.coordinates[0], endEvent.coordinates[1]]
        
        // Fetch route from Mapbox Directions API
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw`
        )
        const data = await response.json()
        
        if (data.routes && data.routes[0]) {
          const route = data.routes[0]
          const layerId = `route-${i}`
          
          // Add route source
          map.current.addSource(layerId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          })
          
          // Add route layer
          map.current.addLayer({
            id: layerId,
            type: 'line',
            source: layerId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 3,
              'line-opacity': 0.7
            }
          })
          
          routeLayerRef.current.push(layerId)
        }
      }
    } catch (error) {
      console.error('Error adding journey routes:', error)
    }
  }

  // NEW: Advanced routing with multiple transport modes
  const addAdvancedRoutes = async (profile: 'driving' | 'walking' | 'cycling' | 'driving-traffic' = 'driving') => {
    if (!map.current || journey.length < 2) return

    try {
      // Build waypoints string for multi-stop optimization
      const waypoints = journey.map(event => `${event.coordinates[0]},${event.coordinates[1]}`).join(';')
      
      // Fetch optimized route
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${waypoints}?geometries=geojson&overview=full&steps=true&voice_instructions=true&banner_instructions=true&access_token=pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw`
      )
      const data = await response.json()
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0]
        
        // Clear existing routes
        routeLayerRef.current.forEach(layerId => {
          if (map.current?.getLayer(layerId)) {
            map.current.removeLayer(layerId)
          }
          if (map.current?.getSource(layerId)) {
            map.current.removeSource(layerId)
          }
        })
        routeLayerRef.current = []
        
        // Add optimized route
        const layerId = `optimized-route`
        map.current.addSource(layerId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              duration: route.duration,
              distance: route.distance
            },
            geometry: route.geometry
          }
        })
        
        // Route line with gradient effect
        map.current.addLayer({
          id: layerId,
          type: 'line',
          source: layerId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': profile === 'walking' ? '#22c55e' : 
                          profile === 'cycling' ? '#f59e0b' : 
                          profile === 'driving-traffic' ? '#ef4444' : '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        })
        
        routeLayerRef.current.push(layerId)
        
        return {
          duration: Math.round(route.duration / 60), // Convert to minutes
          distance: Math.round(route.distance / 1000 * 10) / 10, // Convert to km
          steps: route.legs?.map((leg: any) => leg.steps).flat() || []
        }
      }
    } catch (error) {
      console.error('Error adding advanced routes:', error)
    }
  }

  // NEW: Isochrone visualization (travel time areas)
  const addIsochrones = async (minutes: number[] = [15, 30, 45], profile: 'walking' | 'driving' = 'driving') => {
    if (!map.current) return

    try {
      const userCoords = `${USER_LOCATION.coordinates[0]},${USER_LOCATION.coordinates[1]}`
      
      for (const minute of minutes) {
        const response = await fetch(
          `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${userCoords}?contours_minutes=${minute}&polygons=true&access_token=pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw`
        )
        const data = await response.json()
        
        if (data.features && data.features[0]) {
          const layerId = `isochrone-${minute}`
          
          map.current.addSource(layerId, {
            type: 'geojson',
            data: data.features[0]
          })
          
          map.current.addLayer({
            id: layerId,
            type: 'fill',
            source: layerId,
            paint: {
              'fill-color': minute === 15 ? '#22c55e' : minute === 30 ? '#f59e0b' : '#ef4444',
              'fill-opacity': 0.1
            }
          })
          
          map.current.addLayer({
            id: `${layerId}-outline`,
            type: 'line',
            source: layerId,
            paint: {
              'line-color': minute === 15 ? '#22c55e' : minute === 30 ? '#f59e0b' : '#ef4444',
              'line-width': 2,
              'line-opacity': 0.8
            }
          })
          
          routeLayerRef.current.push(layerId, `${layerId}-outline`)
        }
      }
    } catch (error) {
      console.error('Error adding isochrones:', error)
    }
  }

  // NEW: Travel time matrix for all events
  const calculateTravelMatrix = async () => {
    if (!map.current || mapboxEvents.length === 0) return

    try {
      const coordinates = [
        `${USER_LOCATION.coordinates[0]},${USER_LOCATION.coordinates[1]}`,
        ...mapboxEvents.slice(0, 24).map(event => `${event.coordinates[0]},${event.coordinates[1]}`) // API limit
      ]
      
      const coordString = coordinates.join(';')
      
      const response = await fetch(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordString}?access_token=pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw`
      )
      const data = await response.json()
      
      if (data.durations && data.distances) {
        // Update events with actual travel times from user location
        const updatedEvents = mapboxEvents.map((event, index) => ({
          ...event,
          actualTravelTime: data.durations[0][index + 1] ? Math.round(data.durations[0][index + 1] / 60) : null,
          actualDistance: data.distances[0][index + 1] ? Math.round(data.distances[0][index + 1] / 1000 * 10) / 10 : null
        }))
        
        return updatedEvents
      }
    } catch (error) {
      console.error('Error calculating travel matrix:', error)
    }
  }

  const handleLike = (eventId: string) => {
    setLikedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }))
  }

  const handleFlag = (contentType: 'post' | 'event' | 'social', contentId: string, contentTitle?: string) => {
    setFlagModal({
      isOpen: true,
      contentType,
      contentId,
      contentTitle
    })
  }

  const closeFlagModal = () => {
    setFlagModal({
      isOpen: false,
      contentType: 'event',
      contentId: '',
      contentTitle: ''
    })
  }

  const handleSwipeAction = (action: 'skip' | 'like' | 'maybe' | 'notify') => {
    const currentEvent = getFilteredEvents()[currentSwipeIndex]
    
    setSwipeStats(prev => ({
      ...prev,
      viewed: prev.viewed + 1,
      ...(action === 'like' && { liked: prev.liked + 1 }),
      ...(action === 'maybe' && { maybe: prev.maybe + 1 }),
      ...(action === 'notify' && { notify: prev.notify + 1 })
    }))

    // Handle different actions
    switch (action) {
      case 'skip':
        setSkippedEvents(prev => [...prev, currentEvent.id])
        break
      case 'like':
        setJourney(prev => [...prev, { ...currentEvent, status: 'confirmed' }])
        break
      case 'maybe':
        setMaybeEvents(prev => [...prev, currentEvent])
        setJourney(prev => [...prev, { ...currentEvent, status: 'maybe' }])
        break
      case 'notify':
        setNotifyEvents(prev => [...prev, currentEvent])
        break
    }

    // Move to next event
    if (currentSwipeIndex < getFilteredEvents().length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1)
    } else {
      setCurrentSwipeIndex(0) // Loop back to first
    }
  }

  const calculateJourneyStats = () => {
    const totalTime = journey.reduce((sum, event) => sum + event.journeyTiming, 0)
    const totalCost = journey.reduce((sum, event) => sum + event.price, 0)
    const totalDistance = journey.length > 1 ? 2.5 : 0 // Simplified calculation
    const avgTrust = journey.length > 0 ? 
      journey.reduce((sum, event) => sum + event.trustScore, 0) / journey.length : 0
    
    return { totalTime, totalCost, totalDistance, avgTrust }
  }

  // Add time conflict detection
  const detectTimeConflicts = () => {
    const conflicts: string[] = []
    
    for (let i = 0; i < journey.length - 1; i++) {
      const currentEvent = journey[i]
      const nextEvent = journey[i + 1]
      
      // Parse time strings (assuming format like "7:00 PM")
      const currentTime = parseTimeString(currentEvent.time)
      const nextTime = parseTimeString(nextEvent.time)
      const currentDuration = currentEvent.journeyTiming // in minutes
      
      if (currentTime && nextTime) {
        const currentEndTime = currentTime + currentDuration
        const travelTime = 15 // Assume 15 min travel between events
        const requiredNextStartTime = currentEndTime + travelTime
        
        if (nextTime < requiredNextStartTime) {
          conflicts.push(`${currentEvent.title} → ${nextEvent.title}`)
        }
      }
    }
    
    return conflicts
  }

  const parseTimeString = (timeStr: string): number | null => {
    try {
      const [time, period] = timeStr.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      let totalMinutes = hours * 60 + (minutes || 0)
      
      if (period?.toLowerCase() === 'pm' && hours !== 12) {
        totalMinutes += 12 * 60
      } else if (period?.toLowerCase() === 'am' && hours === 12) {
        totalMinutes = minutes || 0
      }
      
      return totalMinutes
    } catch {
      return null
    }
  }

  const removeFromJourney = (eventId: string) => {
    setJourney(prev => prev.filter(event => event.id !== eventId))
  }

  const handleExploreMode = (enabled: boolean) => {
    setExploreMode(enabled)
  }

  const shareJourney = async (method: 'link' | 'social' | 'copy') => {
    const stats = calculateJourneyStats()
    const shareText = `🎯 Check out my Phoenix journey! ${journey.length} events, ${Math.round(stats.totalTime / 60)}h duration, $${stats.totalCost} total. Join me! 🚀`
    
    switch (method) {
      case 'copy':
        await navigator.clipboard.writeText(shareText)
        alert('Journey copied to clipboard!')
        break
      case 'social':
        if (navigator.share) {
          await navigator.share({
            title: 'My Phoenix Journey',
            text: shareText
          })
        }
        break
      case 'link':
        window.open(`mailto:?subject=Join my Phoenix journey!&body=${encodeURIComponent(shareText)}`, '_blank')
        break
    }
    setShowShareModal(false)
  }

  // Function to load a journey (called from URL params or upcoming tab)
  const loadJourney = (journeyData: any) => {
    setJourney(journeyData.events || [])
    setActiveTab('discover')
    
    // Center map on first event if available
    if (journeyData.events && journeyData.events.length > 0) {
      const firstEvent = journeyData.events[0]
      map.current?.flyTo({
        center: firstEvent.coordinates,
        zoom: 13
      })
    }
  }

  const distances = ['2 miles', '5 miles', '10 miles', '25 miles']
  const categories = ['Tech', 'Social', 'Professional', 'Outdoors', 'Art']
  const timeframes = ['tonight', 'tomorrow', 'week', 'anytime']
  const trustLevels = ['all', '60+', '75+', '85+']

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'tech': return '💻'
      case 'social': return '🎉'
      case 'professional': return '💼'
      case 'adventure': return '🥾'
      case 'arts': return '🎨'
      case 'food': return '🍕'
      case 'entertainment': return '🎭'
      case 'sports': return '🏃'
      case 'education': return '📚'
      case 'wellness': return '🧘'
      case 'community': return '🤝'
      case 'hobby': return '🎯'
      default: return '📍'
    }
  }

  const renderEventCard = (event: Event, isPast = false) => {
    const host = sampleUsers.find(u => u.id === event.hostId)
    if (!host) return null

    const spotsLeft = event.maxAttendees - event.attendeeCount

    return (
      <div key={event.id} className="card-soft hover:shadow-lg transition-shadow duration-200">
        <div className="relative mb-4 -mx-6 -mt-6">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={400}
            height={200}
            className={`w-full h-48 object-cover rounded-t-2xl ${isPast ? 'grayscale opacity-75' : ''}`}
          />
          
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {event.isPrivate ? (
              <div className="bg-slate-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <LockClosedIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Private</span>
              </div>
            ) : (
              <div className="bg-cyan-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <GlobeAltIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Public</span>
              </div>
            )}
            
            <div className="bg-teal-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{event.category}</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-slate-800">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Image
              src={host.avatar}
              alt={host.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <Link href={`/user/${host.id}`} className="font-medium text-slate-800 hover:text-cyan-600">
                {host.name}
              </Link>
              <p className="text-sm text-slate-500">hosting</p>
            </div>
          </div>
          <TrustBadge score={host.trustScore} size="sm" />
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h4>
          <p className="text-slate-600 mb-3 line-clamp-2">{event.description}</p>
          
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-cyan-500" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4 text-cyan-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-4 h-4 text-cyan-500" />
              <span>
                {event.attendeeCount} attending
                {!isPast && spotsLeft > 0 && ` • ${spotsLeft} spots left`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {event.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-cyan-50 text-cyan-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 btn-primary text-center py-2"
          >
            View & RSVP
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleLike(event.id)
            }}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
          >
            {likedEvents[event.id] ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-slate-500" />
            )}
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleFlag('event', event.id, event.title)
            }}
            className="p-2 rounded-xl hover:bg-orange-100 transition-colors duration-200"
          >
            <FlagIcon className="w-5 h-5 text-orange-500" />
          </button>
        </div>
      </div>
    )
  }

  const upcomingEvents = events.filter(event => !event.isPast)
  const pastEvents = events.filter(event => event.isPast)

  return (
    <Layout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Events</h1>
            <p className="text-slate-600">Discover and join amazing events in your community</p>
          </div>
          <Link
            href="/my-events" 
            className="btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-2 px-4 rounded-xl flex items-center space-x-2"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>My Events</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
            { key: 'past', label: 'Past', count: pastEvents.length },
            { key: 'discover', label: 'Discover', count: getFilteredEvents().length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any)
                if (tab.key === 'discover') {
                  initializeMapbox()
                }
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-cyan-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && (
            <>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => renderEventCard(event))
              ) : (
                <div className="card-soft text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No upcoming events</h3>
                  <p className="text-slate-500 mb-6">Create an event or explore what others are hosting</p>
                  <Link href="/create-event" className="btn-primary">
                    Create Event
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === 'past' && (
            <>
              {pastEvents.length > 0 ? (
                <div className="space-y-8">
                  {pastEvents.map(event => renderEventCard(event, true))}
                </div>
              ) : (
                <div className="card-soft text-center py-12">
                  <ClockIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No past events</h3>
                  <p className="text-slate-500">Events you've attended will appear here</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'discover' && (
            <div className="space-y-4">
              {/* Discovery Controls */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-slate-800">🗺️ Discover Events</h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowAddressSearch(!showAddressSearch)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${showAddressSearch ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                    >
                      🔍 {showAddressSearch ? 'Searching' : 'Explore'}
                    </button>
                    {journey.length > 0 && (
                      <button 
                        onClick={() => setShowShareModal(true)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition-colors"
                      >
                        📤 Share Journey
                      </button>
                    )}
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-3 py-1 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      🔽 Filters
                    </button>
                  </div>
                </div>

                {/* Time Conflict Warnings */}
                {journey.length > 1 && (() => {
                  const conflicts = detectTimeConflicts()
                  return conflicts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-red-600">⚠️</span>
                        <span className="font-medium text-red-800">Time Conflicts Detected</span>
                      </div>
                      <div className="space-y-1">
                        {conflicts.map((conflict, index) => (
                          <div key={index} className="text-sm text-red-700">
                            🔴 {conflict}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-red-600 mt-2">
                        💡 Consider adjusting your journey or allowing more travel time
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Address Search */}
              {showAddressSearch && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="text" 
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Enter address or location..."
                      className="flex-1 p-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={async () => {
                        if (searchAddress.trim()) {
                          try {
                            // Geocode the address and center map
                            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?access_token=pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw`)
                            const data = await response.json()
                            if (data.features && data.features.length > 0) {
                              const [lng, lat] = data.features[0].center
                              map.current?.flyTo({
                                center: [lng, lat],
                                zoom: 12
                              })
                              setShowAddressSearch(false)
                              setSearchAddress('')
                            }
                          } catch (error) {
                            console.error('Geocoding error:', error)
                          }
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      🎯 Go
                    </button>
                    <button 
                      onClick={() => setShowAddressSearch(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}

              {/* Filters */}
              {showFilters && (
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Distance</label>
                      <select 
                        value={filters.distance} 
                        onChange={(e) => setFilters({...filters, distance: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      >
                        {distances.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <select 
                        value={activeCategoryFilter} 
                        onChange={(e) => {
                          setActiveCategoryFilter(e.target.value)
                          setCurrentSwipeIndex(0)
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      >
                        <option value="">🎯 All ({mapboxEvents.length})</option>
                        <option value="tech">💻 Tech ({mapboxEvents.filter(e => e.category === 'tech').length})</option>
                        <option value="social">🎉 Social ({mapboxEvents.filter(e => e.category === 'social').length})</option>
                        <option value="arts">🎨 Arts ({mapboxEvents.filter(e => e.category === 'arts').length})</option>
                        <option value="adventure">🥾 Adventure ({mapboxEvents.filter(e => e.category === 'adventure').length})</option>
                        <option value="food">🍕 Food ({mapboxEvents.filter(e => e.category === 'food').length})</option>
                        <option value="sports">🏃 Sports ({mapboxEvents.filter(e => e.category === 'sports').length})</option>
                        <option value="professional">💼 Professional ({mapboxEvents.filter(e => e.category === 'professional').length})</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                      <select 
                        value={filters.time} 
                        onChange={(e) => setFilters({...filters, time: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      >
                        {timeframes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Trust Level</label>
                      <select 
                        value={filters.trustLevel} 
                        onChange={(e) => setFilters({...filters, trustLevel: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      >
                        {trustLevels.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Advanced Map Features */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">🗺️ Advanced Map Features</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <button
                        onClick={() => addIsochrones([15, 30, 45], 'driving')}
                        className="p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      >
                        🚗 Travel Zones
                      </button>
                      <button
                        onClick={() => addIsochrones([15, 30, 45], 'walking')}
                        className="p-2 text-xs bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                      >
                        🚶 Walking Zones
                      </button>
                      <button
                        onClick={async () => {
                          const matrix = await calculateTravelMatrix()
                          if (matrix) {
                            // Travel matrix calculated
                            // You could update UI with real travel times
                          }
                        }}
                        className="p-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                      >
                        📊 Travel Times
                      </button>
                      <button
                        onClick={() => {
                          // Clear all overlays
                          routeLayerRef.current.forEach(layerId => {
                            if (map.current?.getLayer(layerId)) {
                              map.current.removeLayer(layerId)
                            }
                            if (map.current?.getSource(layerId)) {
                              map.current.removeSource(layerId)
                            }
                          })
                          routeLayerRef.current = []
                        }}
                        className="p-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        🧹 Clear Overlays
                      </button>
                    </div>

                    {/* Transport Mode Selection */}
                    {journey.length > 1 && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-slate-600 mb-2">Journey Transport Mode:</label>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => addAdvancedRoutes('driving')}
                            className="p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          >
                            🚗 Drive
                          </button>
                          <button
                            onClick={() => addAdvancedRoutes('walking')}
                            className="p-2 text-xs bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                          >
                            🚶 Walk
                          </button>
                          <button
                            onClick={() => addAdvancedRoutes('cycling')}
                            className="p-2 text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                          >
                            🚴 Bike
                          </button>
                          <button
                            onClick={() => addAdvancedRoutes('driving-traffic')}
                            className="p-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            🚦 Traffic
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Map Section - Full Width */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="h-96 relative">
                  <div ref={mapContainer} className="w-full h-full"></div>
                  {exploreMode && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      🔍 Explore Mode Active
                    </div>
                  )}
                </div>
              </div>



              {/* Discovery & Journey Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Discovery Panel */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  {/* Refresh and Restart Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button 
                      onClick={() => {
                        // Refresh functionality - could fetch new events
                        setSwipeStats(prev => ({ ...prev, viewed: 0 }))
                        setCurrentSwipeIndex(0)
                      }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>🔄</span>
                      <span>Refresh</span>
                    </button>
                    <button 
                      onClick={() => {
                        // Restart functionality - clear all selections
                        setJourney([])
                        setMaybeEvents([])
                        setNotifyEvents([])
                        setSkippedEvents([])
                        setSwipeStats({ viewed: 0, liked: 0, maybe: 0, notify: 0 })
                        setCurrentSwipeIndex(0)
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>↩️</span>
                      <span>Restart</span>
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 mb-4">📋 Currently Viewing Event {currentSwipeIndex + 1} of {getFilteredEvents().length}:</h3>
                  {getFilteredEvents()[currentSwipeIndex] && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">
                            {getEventIcon(getFilteredEvents()[currentSwipeIndex].category)} {getFilteredEvents()[currentSwipeIndex].title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            getFilteredEvents()[currentSwipeIndex].eventType === 'public' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {getFilteredEvents()[currentSwipeIndex].eventType === 'public' ? '🔵 Public' : '🔴 Private'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {getFilteredEvents()[currentSwipeIndex].description}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs text-center mb-3">
                          <div>
                            <div className="font-medium text-slate-800">{getFilteredEvents()[currentSwipeIndex].time}</div>
                            <div className="text-slate-500">Time</div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">${getFilteredEvents()[currentSwipeIndex].price === 0 ? 'Free' : getFilteredEvents()[currentSwipeIndex].price}</div>
                            <div className="text-slate-500">Cost</div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">⭐ {getFilteredEvents()[currentSwipeIndex].trustScore}%</div>
                            <div className="text-slate-500">Trust</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mb-3">
                          📍 {getFilteredEvents()[currentSwipeIndex].location} • {getFilteredEvents()[currentSwipeIndex].distance}mi away • 👥 {getFilteredEvents()[currentSwipeIndex].attendeeCount}/{getFilteredEvents()[currentSwipeIndex].maxAttendees}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <button 
                            onClick={() => handleSwipeAction('skip')}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            Skip
                          </button>
                          <button 
                            onClick={() => handleSwipeAction('maybe')}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            Maybe
                          </button>
                          <button 
                            onClick={() => handleSwipeAction('like')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            ❤️
                          </button>
                          <button 
                            onClick={() => handleSwipeAction('notify')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            🔔 Notify
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 text-center">
                        {swipeStats.viewed} viewed • ❤️ {swipeStats.liked} liked • ❓ {swipeStats.maybe} maybe • 🔔 {swipeStats.notify} notify
                      </div>
                    </div>
                  )}
                </div>

                {/* Journey Panel */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800 mb-4">🧳 Journey Planner</h3>
                  {journey.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🎯</div>
                      <h4 className="font-medium text-slate-800 mb-2">Build Your Perfect Night</h4>
                      <p className="text-sm text-slate-600">
                        Add events from the discovery panel to create your optimized journey.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Journey Stats */}
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="grid grid-cols-4 gap-2 text-xs text-center">
                          {(() => {
                            const stats = calculateJourneyStats()
                            return (
                              <>
                                <div>
                                  <div className="font-medium text-slate-800">{Math.round(stats.totalTime / 60)}h</div>
                                  <div className="text-slate-500">Duration</div>
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800">${stats.totalCost}</div>
                                  <div className="text-slate-500">Cost</div>
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800">{stats.totalDistance.toFixed(1)}mi</div>
                                  <div className="text-slate-500">Travel</div>
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800">{Math.round(stats.avgTrust)}%</div>
                                  <div className="text-slate-500">Trust</div>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>

                      {/* Journey Events with Travel Options */}
                      <div className="space-y-2">
                        {journey.map((event, index) => (
                          <div key={event.id}>
                            {/* Travel Section (except for first event) */}
                            {index > 0 && (
                              <div className="flex items-center justify-center py-2">
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  <div className="w-px h-4 bg-slate-300"></div>
                                  <select className="bg-slate-100 border-0 rounded px-2 py-1 text-xs">
                                    <option>🚶 Walk (5 min)</option>
                                    <option>🚗 Drive (2 min)</option>
                                    <option>🚇 Metro (8 min)</option>
                                  </select>
                                  <div className="w-px h-4 bg-slate-300"></div>
                                </div>
                              </div>
                            )}
                            
                            {/* Event */}
                            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  event.status === 'maybe' 
                                    ? 'bg-yellow-100 text-yellow-600' 
                                    : 'bg-purple-100 text-purple-600'
                                }`}>
                                  {event.status === 'maybe' ? '❓' : (index + 1)}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-medium text-slate-800 text-sm">{event.title}</h5>
                                    {event.status === 'maybe' && (
                                      <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">Maybe</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500">{event.time} • {event.journeyTiming}min • {getEventIcon(event.category)}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeFromJourney(event.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Journey Action Buttons */}
                      <div className="space-y-2">
                        <button 
                          onClick={() => {
                            // Start Journey - Save to My Journeys and clear planner
                            const journeyData = {
                              id: `journey_${Date.now()}`,
                              name: `My Phoenix Journey - ${new Date().toLocaleDateString()}`,
                              events: journey,
                              createdAt: new Date().toISOString(),
                              status: 'active'
                            }
                            
                            // Save to localStorage for My Journeys section
                            const existingJourneys = JSON.parse(localStorage.getItem('userJourneys') || '[]')
                            existingJourneys.push(journeyData)
                            localStorage.setItem('userJourneys', JSON.stringify(existingJourneys))
                            
                            // Clear the planner
                            setJourney([])
                            setMaybeEvents([])
                            setNotifyEvents([])
                            setSkippedEvents([])
                            setSwipeStats({ viewed: 0, liked: 0, maybe: 0, notify: 0 })
                            setCurrentSwipeIndex(0)
                            
                            alert('🎉 Journey saved to My Journeys! Check the My Events page to manage your saved journeys.')
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                          🚀 Start Your Journey
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              // Save as Draft
                              const draftData = {
                                id: `draft_${Date.now()}`,
                                name: `Draft Journey - ${new Date().toLocaleDateString()}`,
                                events: journey,
                                createdAt: new Date().toISOString(),
                                status: 'draft'
                              }
                              
                              const existingDrafts = JSON.parse(localStorage.getItem('userDrafts') || '[]')
                              existingDrafts.push(draftData)
                              localStorage.setItem('userDrafts', JSON.stringify(existingDrafts))
                              
                              alert('💾 Journey saved as draft!')
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            💾 Save Draft
                          </button>
                          
                          <button 
                            onClick={() => setShowShareModal(true)}
                            className="bg-green-200 hover:bg-green-300 text-green-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            📤 Share
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Journey Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Share Your Journey</h3>
              <p className="text-slate-600 text-sm">
                Let friends join your adventure!
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => shareJourney('copy')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>📋</span>
                <span>Copy Link</span>
              </button>
              
              <button 
                onClick={() => shareJourney('social')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>🐦</span>
                <span>Share on Social</span>
              </button>
              
              <button 
                onClick={() => shareJourney('link')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>✉️</span>
                <span>Send Email</span>
              </button>
            </div>

            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      <FlagModal
        isOpen={flagModal.isOpen}
        contentType={flagModal.contentType}
        contentId={flagModal.contentId}
        contentTitle={flagModal.contentTitle}
        onClose={closeFlagModal}
      />
    </Layout>
  )
} 