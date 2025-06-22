'use client'

import React, { useState, useEffect, useRef } from 'react'
import Layout from '@/components/Layout'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  EyeIcon,
  BellIcon,
  ShareIcon,
  RadioIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// Mock address suggestions for autocomplete
const mockAddressSuggestions = [
  "123 Main Street, Phoenix, AZ 85001",
  "456 Central Avenue, Phoenix, AZ 85004", 
  "789 Roosevelt Street, Phoenix, AZ 85003",
  "321 Thomas Road, Phoenix, AZ 85012",
  "654 Indian School Road, Phoenix, AZ 85018",
  "987 Camelback Road, Phoenix, AZ 85014"
]

// Demo events within 5 miles
const demoEvents = [
  {
    id: 'event1',
    title: 'JavaScript Workshop',
    category: 'Tech',
    emoji: '💻',
    time: 'Tonight 7PM',
    distance: '0.8mi',
    attendees: 24,
    status: 'live',
    statusColor: '🔴',
    trustScore: 87,
    organizer: 'Sarah Chen',
    location: 'WeWork Central',
    description: 'Learn modern JavaScript frameworks',
    liveCount: 24,
    lat: 33.4484,
    lng: -112.0740
  },
  {
    id: 'event2', 
    title: 'Art Gallery Opening',
    category: 'Art',
    emoji: '🎨',
    time: 'Starting now!',
    distance: '1.2mi',
    attendees: 15,
    status: 'starting',
    statusColor: '💫',
    trustScore: 92,
    organizer: 'Maria Santos',
    location: 'Phoenix Art Museum',
    description: 'Local artists showcase',
    liveCount: 15,
    lat: 33.4673,
    lng: -112.0635
  },
  {
    id: 'event3',
    title: 'Coffee & Code',
    category: 'Social',
    emoji: '☕',
    time: 'In progress',
    distance: '2.1mi', 
    attendees: 8,
    status: 'active',
    statusColor: '🟢',
    trustScore: 78,
    organizer: 'Mike Johnson',
    location: 'Starbucks Downtown',
    description: 'Casual coding meetup',
    liveCount: 8,
    lat: 33.4500,
    lng: -112.0667
  },
  {
    id: 'event4',
    title: 'Hiking Group',
    category: 'Outdoor',
    emoji: '🥾',
    time: 'Starts 30min',
    distance: '3.5mi',
    attendees: 12,
    status: 'upcoming',
    statusColor: '⏰',
    trustScore: 88,
    organizer: 'Alex Rivera',
    location: 'Camelback Trailhead',
    description: 'Morning hike adventure',
    liveCount: 0,
    lat: 33.5185,
    lng: -111.9714
  },
  {
    id: 'event5',
    title: 'Rooftop Social',
    category: 'Social', 
    emoji: '🎉',
    time: 'FULL: 50/50',
    distance: '4.2mi',
    attendees: 50,
    status: 'full',
    statusColor: '🔴',
    trustScore: 91,
    organizer: 'Emma Davis',
    location: 'Downtown Rooftop',
    description: 'Networking and drinks',
    liveCount: 50,
    lat: 33.4500,
    lng: -112.0700
  },
  {
    id: 'event6',
    title: 'Business Meetup',
    category: 'Business',
    emoji: '💼',
    time: 'In progress',
    distance: '4.8mi',
    attendees: 18,
    status: 'active',
    statusColor: '🟡',
    trustScore: 76,
    organizer: 'David Kim',
    location: 'Business Center',
    description: 'Startup networking event',
    liveCount: 18,
    lat: 33.4400,
    lng: -112.0800
  }
]

export default function DiscoverMapPage() {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  
  const [userAddress, setUserAddress] = useState('')
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [arLayers, setArLayers] = useState({
    liveAttendance: true,
    liveStatus: true,
    timeAlerts: false,
    popularRoutes: false,
    liveChat: false,
    walkingDirections: false
  })
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load Mapbox GL JS
  useEffect(() => {
    if (!isClient) return

    const loadMapbox = async () => {
      // Load Mapbox CSS
      const link = document.createElement('link')
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // Load Mapbox JS
      const script = document.createElement('script')
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
      script.onload = () => {
        setMapboxLoaded(true)
      }
      document.head.appendChild(script)
    }

    loadMapbox()
  }, [isClient])

  // Initialize map
  useEffect(() => {
    if (!mapboxLoaded || map.current || !mapContainer.current) return

    // Use the provided Mapbox token
    const mapboxToken = 'pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw'
    
    // @ts-ignore
    window.mapboxgl.accessToken = mapboxToken

    // @ts-ignore
    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-112.0740, 33.4484], // Phoenix, AZ
      zoom: 12
    })

    // Add navigation control
    // @ts-ignore
    map.current.addControl(new window.mapboxgl.NavigationControl())

    // Add markers for demo events
    demoEvents.forEach((event) => {
      // Create custom marker element
      const markerEl = document.createElement('div')
      markerEl.innerHTML = `
        <div class="bg-white rounded-full p-2 shadow-lg border-2 border-cyan-500 cursor-pointer hover:scale-110 transition-transform">
          <span class="text-lg">${event.emoji}</span>
        </div>
      `
      
      // Add click handler to marker
      markerEl.addEventListener('click', () => {
        setSelectedEvent(event)
      })

      // @ts-ignore
      new window.mapboxgl.Marker(markerEl)
        .setLngLat([event.lng, event.lat])
        .addTo(map.current)
    })

    // Add popup on map click
    map.current.on('click', (e: any) => {
      // @ts-ignore
      const popup = new window.mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-2">
            <h4 class="font-semibold">Clicked Location</h4>
            <p class="text-sm text-gray-600">
              Lat: ${e.lngLat.lat.toFixed(4)}<br>
              Lng: ${e.lngLat.lng.toFixed(4)}
            </p>
          </div>
        `)
        .addTo(map.current)
    })

  }, [mapboxLoaded])

  // Handle address input change
  const handleAddressChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserAddress(value)
    
    if (value.length > 2) {
      const suggestions = mockAddressSuggestions.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      )
      setAddressSuggestions(suggestions)
      setShowAddressSuggestions(suggestions.length > 0)
    } else {
      setShowAddressSuggestions(false)
      setAddressSuggestions([])
    }
  }, [])

  // Select address suggestion
  const selectAddress = React.useCallback((address: string) => {
    setUserAddress(address)
    setShowAddressSuggestions(false)
    setAddressSuggestions([])
    
    // If map is loaded, center on address (simplified for demo)
    if (map.current) {
      // In a real app, you'd geocode the address
      // For demo, just center on Phoenix
      map.current.flyTo({
        center: [-112.0740, 33.4484],
        zoom: 14
      })
    }
  }, [])

  // Toggle AR layer
  const toggleArLayer = (layer: string) => {
    setArLayers(prev => ({
      ...prev,
      [layer]: !prev[layer as keyof typeof prev]
    }))
  }

  if (!isClient) {
    return (
      <Layout>
        <div className="p-4 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Loading Map...</h1>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Interactive Map Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Live Map • Phoenix</h1>
          <div className="flex space-x-2 ml-auto">
            <button className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
              <RadioIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <EyeIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <MapPinIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Address Input with Autocomplete */}
        <div className="card-soft relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📍 Enter your address to find nearby events
          </label>
          <div className="relative">
            <input
              type="text"
              value={userAddress}
              onChange={handleAddressChange}
              placeholder="Type your address (e.g. 123 Main Street, Phoenix, AZ)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
            />
            {showAddressSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectAddress(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real Mapbox Map Container */}
        <div className="card-premium">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">🗺️ Interactive Map with Live Events</h3>
            
            {/* Map Container */}
            <div 
              ref={mapContainer}
              className="w-full h-96 rounded-xl bg-slate-100 relative"
              style={{ minHeight: '400px' }}
            >
              {!mapboxLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-xl">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-slate-600">Loading interactive map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event List Below Map */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {demoEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedEvent?.id === event.id
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{event.emoji}</span>
                    <span className="text-xs">{event.statusColor}</span>
                    <span className="text-xs font-medium text-slate-600">{event.distance}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{event.title}</h4>
                  <p className="text-xs text-slate-600 mb-1">{event.time}</p>
                  {event.status === 'live' || event.status === 'active' ? (
                    <p className="text-xs text-green-600 font-medium">LIVE: {event.liveCount} here</p>
                  ) : event.status === 'starting' ? (
                    <p className="text-xs text-purple-600 font-medium">Starting now!</p>
                  ) : event.status === 'full' ? (
                    <p className="text-xs text-red-600 font-medium">FULL: {event.attendees}/{event.attendees}</p>
                  ) : (
                    <p className="text-xs text-orange-600 font-medium">Starts 30min</p>
                  )}
                </button>
              ))}
            </div>

            {/* AR Layers Control */}
            <div className="bg-slate-50 rounded-xl p-4 mt-4">
              <h4 className="font-semibold text-slate-800 mb-3">👁️ AR Layers</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(arLayers).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => toggleArLayer(key)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-all duration-200 ${
                      value 
                        ? 'bg-cyan-100 text-cyan-700 border border-cyan-300' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs">
                      {key === 'liveAttendance' && '👥'}
                      {key === 'liveStatus' && '🔴'}
                      {key === 'timeAlerts' && '⏰'}
                      {key === 'popularRoutes' && '📊'}
                      {key === 'liveChat' && '💬'}
                      {key === 'walkingDirections' && '🚶'}
                    </span>
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Status */}
            <div className="flex items-center justify-between text-sm text-slate-600 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>📡 LIVE STATUS: Connected • Last updated: 30s ago</span>
              </div>
              <span>🎯 Real-time data from {demoEvents.length} events • {demoEvents.reduce((sum, e) => sum + e.liveCount, 0)} active participants</span>
            </div>
          </div>
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="card-premium bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {selectedEvent.emoji} Currently Selected: {selectedEvent.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-700 mb-2">
                  <strong>{selectedEvent.title}</strong> • {selectedEvent.time} • {selectedEvent.distance} away
                </p>
                <p className="text-slate-600 mb-2">
                  📍 {selectedEvent.location} • Organizer: {selectedEvent.organizer} (⭐{selectedEvent.trustScore} Trust)
                </p>
                <p className="text-slate-600 mb-4">
                  {selectedEvent.description}
                </p>
                <div className="flex space-x-2">
                  <button className="btn-primary text-sm px-4 py-2">
                    🎟️ Join Event
                  </button>
                  <button className="btn-secondary text-sm px-4 py-2">
                    📍 Directions
                  </button>
                  <button className="btn-secondary text-sm px-4 py-2">
                    💬 Questions
                  </button>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Live Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Attendance:</span>
                    <span className="font-medium">{selectedEvent.liveCount} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Going:</span>
                    <span className="font-medium">{selectedEvent.attendees} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trust Score:</span>
                    <span className="font-medium">⭐{selectedEvent.trustScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium capitalize">{selectedEvent.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Event Stream */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📡 Live Event Stream</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-slate-700 mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span>🔴 HAPPENING NOW:</span>
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div>• 🎨 Art Opening: 15 people just arrived (24 total)</div>
              <div>• 💻 Tech Meetup: Sarah just checked in (Organizer arrived!)</div>
              <div>• ☕ Coffee & Code: 3 spots left, very active chat</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-slate-700 mb-2">⏰ STARTING SOON:</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div>• 🥾 Hiking Group in 30min (Meeting at trailhead)</div>
              <div>• 🎉 Rooftop Social in 2hrs (Getting busy, reserve now!)</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="flex items-center space-x-1 px-3 py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium">
              <BellIcon className="w-4 h-4" />
              <span>Set Live Alerts</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
              <ShareIcon className="w-4 h-4" />
              <span>Share Location</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
              <EyeIcon className="w-4 h-4" />
              <span>AR Camera Mode</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 