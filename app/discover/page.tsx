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

// Comprehensive US address suggestions for autocomplete
const usAddressSuggestions = [
  // New York
  "123 Broadway, New York, NY 10001",
  "456 Fifth Avenue, New York, NY 10018",
  "789 Wall Street, New York, NY 10005",
  "321 Madison Avenue, New York, NY 10017",
  "654 Park Avenue, New York, NY 10065",
  "987 Times Square, New York, NY 10036",
  
  // Los Angeles
  "123 Hollywood Boulevard, Los Angeles, CA 90028",
  "456 Sunset Boulevard, Los Angeles, CA 90027",
  "789 Melrose Avenue, Los Angeles, CA 90046",
  "321 Santa Monica Boulevard, Los Angeles, CA 90069",
  "654 Wilshire Boulevard, Los Angeles, CA 90010",
  "987 Rodeo Drive, Beverly Hills, CA 90210",
  
  // Chicago
  "123 Michigan Avenue, Chicago, IL 60601",
  "456 State Street, Chicago, IL 60605",
  "789 Lake Shore Drive, Chicago, IL 60611",
  "321 Wabash Avenue, Chicago, IL 60604",
  "654 Rush Street, Chicago, IL 60611",
  "987 Lincoln Avenue, Chicago, IL 60614",
  
  // Houston
  "123 Main Street, Houston, TX 77002",
  "456 Louisiana Street, Houston, TX 77002",
  "789 Travis Street, Houston, TX 77002",
  "321 McKinney Street, Houston, TX 77010",
  "654 Richmond Avenue, Houston, TX 77057",
  "987 Westheimer Road, Houston, TX 77027",
  
  // Phoenix
  "123 Central Avenue, Phoenix, AZ 85004",
  "456 Camelback Road, Phoenix, AZ 85014",
  "789 Indian School Road, Phoenix, AZ 85018",
  "321 Thomas Road, Phoenix, AZ 85012",
  "654 McDowell Road, Phoenix, AZ 85006",
  "987 Van Buren Street, Phoenix, AZ 85007",
  
  // Philadelphia
  "123 Market Street, Philadelphia, PA 19107",
  "456 Broad Street, Philadelphia, PA 19146",
  "789 Chestnut Street, Philadelphia, PA 19106",
  "321 Walnut Street, Philadelphia, PA 19106",
  "654 South Street, Philadelphia, PA 19147",
  "987 Spring Garden Street, Philadelphia, PA 19123",
  
  // San Antonio
  "123 Commerce Street, San Antonio, TX 78205",
  "456 Houston Street, San Antonio, TX 78205",
  "789 Broadway Street, San Antonio, TX 78215",
  "321 Navarro Street, San Antonio, TX 78205",
  "654 McCullough Avenue, San Antonio, TX 78212",
  "987 Austin Highway, San Antonio, TX 78209",
  
  // San Diego
  "123 Harbor Drive, San Diego, CA 92101",
  "456 Fifth Avenue, San Diego, CA 92101",
  "789 University Avenue, San Diego, CA 92103",
  "321 Park Boulevard, San Diego, CA 92101",
  "654 El Cajon Boulevard, San Diego, CA 92115",
  "987 Adams Avenue, San Diego, CA 92116",
  
  // Dallas
  "123 Main Street, Dallas, TX 75201",
  "456 Commerce Street, Dallas, TX 75202",
  "789 Elm Street, Dallas, TX 75202",
  "321 McKinney Avenue, Dallas, TX 75204",
  "654 Greenville Avenue, Dallas, TX 75206",
  "987 Cedar Springs Road, Dallas, TX 75219",
  
  // San Jose
  "123 First Street, San Jose, CA 95113",
  "456 Santa Clara Street, San Jose, CA 95113",
  "789 The Alameda, San Jose, CA 95126",
  "321 Park Avenue, San Jose, CA 95110",
  "654 Bascom Avenue, San Jose, CA 95128",
  "987 Stevens Creek Boulevard, San Jose, CA 95129",
  
  // Austin
  "123 Congress Avenue, Austin, TX 78701",
  "456 Sixth Street, Austin, TX 78701",
  "789 South Lamar Boulevard, Austin, TX 78704",
  "321 Guadalupe Street, Austin, TX 78705",
  "654 Barton Springs Road, Austin, TX 78704",
  "987 Rainey Street, Austin, TX 78701",
  
  // Jacksonville
  "123 Bay Street, Jacksonville, FL 32202",
  "456 Main Street, Jacksonville, FL 32202",
  "789 Forsyth Street, Jacksonville, FL 32202",
  "321 Ocean Street, Jacksonville, FL 32202",
  "654 University Boulevard, Jacksonville, FL 32211",
  "987 Atlantic Boulevard, Jacksonville, FL 32225",
  
  // Fort Worth
  "123 Main Street, Fort Worth, TX 76102",
  "456 Houston Street, Fort Worth, TX 76102",
  "789 Commerce Street, Fort Worth, TX 76102",
  "321 Camp Bowie Boulevard, Fort Worth, TX 76107",
  "654 West Seventh Street, Fort Worth, TX 76102",
  "987 University Drive, Fort Worth, TX 76109",
  
  // Columbus
  "123 Broad Street, Columbus, OH 43215",
  "456 High Street, Columbus, OH 43215",
  "789 Long Street, Columbus, OH 43215",
  "321 Gay Street, Columbus, OH 43215",
  "654 North High Street, Columbus, OH 43201",
  "987 Olentangy River Road, Columbus, OH 43212",
  
  // Indianapolis
  "123 Meridian Street, Indianapolis, IN 46204",
  "456 Washington Street, Indianapolis, IN 46204",
  "789 Massachusetts Avenue, Indianapolis, IN 46204",
  "321 Monument Circle, Indianapolis, IN 46204",
  "654 Keystone Avenue, Indianapolis, IN 46220",
  "987 College Avenue, Indianapolis, IN 46205",
  
  // Charlotte
  "123 Trade Street, Charlotte, NC 28202",
  "456 Tryon Street, Charlotte, NC 28202",
  "789 Independence Boulevard, Charlotte, NC 28202",
  "321 South Boulevard, Charlotte, NC 28203",
  "654 Park Road, Charlotte, NC 28209",
  "987 Providence Road, Charlotte, NC 28211"
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
    timeAlerts: false
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

  // Handle address input change with enhanced US address matching
  const handleAddressChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserAddress(value)
    
    if (value.length > 2) {
      // Enhanced search algorithm for better address matching
      const searchTerms = value.toLowerCase().split(' ').filter(term => term.length > 0)
      
      const suggestions = usAddressSuggestions.filter((addr: string) => {
        const lowerAddr = addr.toLowerCase()
        // Match if address contains all search terms OR if it matches street number + street name
        return searchTerms.every(term => lowerAddr.includes(term)) ||
               searchTerms.some(term => {
                 // Check for street number matches
                 if (/^\d+$/.test(term)) {
                   return lowerAddr.startsWith(term + ' ')
                 }
                 // Check for city/state matches
                 const cityState = lowerAddr.split(',')[1]?.trim() || ''
                 return cityState.includes(term)
               })
      }).slice(0, 8) // Limit to 8 suggestions for better UX
      
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
              onFocus={() => {
                if (userAddress.length > 2) {
                  setShowAddressSuggestions(true)
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicks
                setTimeout(() => setShowAddressSuggestions(false), 200)
              }}
              placeholder="Start typing a US address... (e.g. 123 Broadway, New York or Dallas, TX)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
              autoComplete="off"
            />
            {showAddressSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-1 shadow-xl z-20 max-h-64 overflow-y-auto">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-medium">
                  📍 US Address Suggestions ({addressSuggestions.length})
                </div>
                {addressSuggestions.map((suggestion, index) => {
                  const parts = suggestion.split(', ')
                  const streetAddress = parts[0]
                  const cityState = parts.slice(1).join(', ')
                  
                  return (
                    <button
                      key={index}
                      onClick={() => selectAddress(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-cyan-50 hover:border-l-4 hover:border-cyan-500 transition-all duration-200 border-b border-slate-100 last:border-b-0 group"
                    >
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 group-hover:text-cyan-700 truncate">
                            {streetAddress}
                          </div>
                          <div className="text-sm text-slate-500 group-hover:text-cyan-600 truncate">
                            {cityState}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          ↩
                        </div>
                      </div>
                    </button>
                  )
                })}
                <div className="px-3 py-2 bg-slate-50 text-xs text-slate-500 text-center border-t border-slate-200">
                  Type street address, city, or state to search US locations
                </div>
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

            {/* Layers Control */}
            <div className="bg-slate-50 rounded-xl p-4 mt-4">
              <h4 className="font-semibold text-slate-800 mb-3">👁️ Layers</h4>
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