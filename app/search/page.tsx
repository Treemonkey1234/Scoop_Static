'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers } from '@/lib/sampleData'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  RadioIcon,
  EyeIcon,
  BellIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

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
    liveCount: 24
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
    liveCount: 15
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
    liveCount: 8
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
    liveCount: 0
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
    liveCount: 50
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
    liveCount: 18
  }
]

type SearchType = 'people' | 'location' | 'map'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('map')
  const [trustFilter, setTrustFilter] = useState<number>(0)
  const [showFilters, setShowFilters] = useState(false)
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

  const filteredUsers = sampleUsers.filter(user => {
    const matchesQuery = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTrust = trustFilter === 0 || user.trustScore >= trustFilter
    
    return matchesQuery && matchesTrust
  })

  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserAddress(value)
    
    if (value.length > 2) {
      const suggestions = mockAddressSuggestions.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      )
      setAddressSuggestions(suggestions)
      setShowAddressSuggestions(true)
    } else {
      setShowAddressSuggestions(false)
    }
  }

  // Select address suggestion
  const selectAddress = (address: string) => {
    setUserAddress(address)
    setShowAddressSuggestions(false)
  }

  // Toggle AR layer
  const toggleArLayer = (layer: string) => {
    setArLayers(prev => ({
      ...prev,
      [layer]: !prev[layer as keyof typeof prev]
    }))
  }

  const recentSearches = [
    'Sarah Chen',
    'UX Designers in SF', 
    'Personal Trainers',
    'Austin Events'
  ]

  const popularCategories = [
    { name: 'Professionals', icon: '💼', count: 234 },
    { name: 'Event Hosts', icon: '🎉', count: 156 },
    { name: 'Service Providers', icon: '🔧', count: 189 },
    { name: 'Venues', icon: '🏢', count: 67 }
  ]

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {searchType === 'map' ? (
          <>
            {/* Interactive Map Header */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setSearchType('people')}
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

            {/* Real-Time AR Map View */}
            <div className="card-premium">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">🗺️ Real-Time AR Map View</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
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
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
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
          </>
        ) : (
          <>
            {/* Original Search Interface */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Search</h1>
              <p className="text-slate-600">Find trusted people and places in your community</p>
            </div>

            {/* Search Bar */}
            <div className="card-soft">
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for people, places, or skills..."
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-3 top-3 p-1 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Search Type Toggle */}
              <div className="flex space-x-1 mb-4 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setSearchType('people')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    searchType === 'people'
                      ? 'bg-white text-primary-600 shadow-soft'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>People</span>
                </button>
                <button
                  onClick={() => setSearchType('location')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    searchType === 'location'
                      ? 'bg-white text-primary-600 shadow-soft'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <MapPinIcon className="w-4 h-4" />
                  <span>Location</span>
                </button>
                <button
                  onClick={() => setSearchType('map')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    searchType === 'map'
                      ? 'bg-white text-primary-600 shadow-soft'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <RadioIcon className="w-4 h-4" />
                  <span>Live Map</span>
                </button>
              </div>

              {/* Rest of original search interface... */}
              {showFilters && (
                <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                  <h3 className="font-semibold text-slate-800">Filters</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Trust Score: {trustFilter}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={trustFilter}
                      onChange={(e) => setTrustFilter(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Any</span>
                      <span>Excellent (85+)</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setTrustFilter(0)
                      setShowFilters(false)
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchQuery ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Results ({filteredUsers.length})
                  </h2>
                  {trustFilter > 0 && (
                    <span className="text-sm text-slate-500">
                      Trust score {trustFilter}+
                    </span>
                  )}
                </div>
                
                {filteredUsers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <Link
                        key={user.id}
                        href={`/user/${user.id}`}
                        className="card-soft transition-all duration-200 block"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={56}
                              height={56}
                              className="rounded-xl"
                            />
                            {user.isVerified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-slate-800">{user.name}</h3>
                              <TrustBadge score={user.trustScore} size="sm" />
                            </div>
                            <p className="text-sm text-slate-600 mb-1">@{user.username}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{user.bio}</p>
                            <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
                              <MapPinIcon className="w-3 h-3" />
                              <span>{user.location}</span>
                              <span>•</span>
                              <span>{user.friendsCount} friends</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.accountType === 'pro' 
                                ? 'bg-amber-100 text-amber-700'
                                : user.accountType === 'venue'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {user.accountType === 'pro' && '👑 Pro'}
                              {user.accountType === 'venue' && '🏢 Venue'}
                              {user.accountType === 'free' && '🆓 Free'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="card-soft text-center py-12">
                    <MagnifyingGlassIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No results found</h3>
                    <p className="text-slate-500">Try adjusting your search terms or filters</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Recent Searches */}
                <div className="card-soft">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Searches</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="flex items-center space-x-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                      >
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div className="card-soft">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Popular Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {popularCategories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(category.name)}
                        className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 hover:from-primary-100 hover:to-primary-200/50 rounded-xl transition-all duration-200 text-left"
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{category.name}</h4>
                        <p className="text-xs text-slate-600">{category.count} members</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Tips */}
                <div className="card-soft">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Search Tips</h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-start space-x-3">
                      <span className="text-primary-500">💡</span>
                      <span>Use keywords like "designer", "trainer", or "chef" to find professionals</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-primary-500">📍</span>
                      <span>Search by location: "San Francisco", "Austin", or "Denver"</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-primary-500">⭐</span>
                      <span>Filter by trust score to find the most reliable members</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  )
} 