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

// Enhanced events data for discovery
const mapboxEvents = [
  {
    id: '1',
    title: 'JavaScript Workshop',
    description: 'Learn React hooks and state management',
    date: 'Tonight',
    time: '7:00 PM',
    location: 'WeWork Central',
    category: 'Tech',
    attendeeCount: 24,
    maxAttendees: 30,
    trustScore: 87,
    distance: 0.8,
    coordinates: [-112.0740, 33.4484],
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
    location: 'Local Coffee Co',
    category: 'Social',
    attendeeCount: 8,
    maxAttendees: 15,
    trustScore: 84,
    distance: 0.3,
    coordinates: [-112.0730, 33.4490],
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
    category: 'Art',
    attendeeCount: 15,
    maxAttendees: 20,
    trustScore: 92,
    distance: 1.2,
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
    location: 'Downtown Rooftop',
    category: 'Social',
    attendeeCount: 32,
    maxAttendees: 50,
    trustScore: 89,
    distance: 0.4,
    coordinates: [-112.0760, 33.4520],
    status: 'open',
    price: 12,
    hostId: '5',
    journeyTiming: 90
  }
]

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
  const [swipeStats, setSwipeStats] = useState({ viewed: 0, liked: 0, added: 0 })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [exploreMode, setExploreMode] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  
  const [filters, setFilters] = useState({
    distance: '5 miles',
    category: '',
    time: 'tonight',
    trustLevel: '75+'
  })

  // Load events, reviews and current user on component mount
  useEffect(() => {
    const allEvents = getAllEvents()
    const allReviews = getAllReviews()
    const user = getCurrentUser()
    setEvents(allEvents)
    setReviews(allReviews)
    setCurrentUser(user)
  }, [])

  // Initialize Mapbox when discover tab is active
  useEffect(() => {
    if (activeTab === 'discover') {
      initializeMapbox()
    }
  }, [activeTab])

  const initializeMapbox = async () => {
    try {
      if (!mapContainer.current) return

      const mapboxgl = (await import('mapbox-gl')).default
      
      // Mapbox token
      const accessToken = 'pk.eyJ1IjoidHJlZW1vbmtleTQ1NiIsImEiOiJjbWMwc3FodnIwNjJ6MmxwdWtpamFkbjVyIn0._yMY5crJh7ujrwoxkm3EVw'
      mapboxgl.accessToken = accessToken

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-112.0740, 33.4484],
        zoom: 12
      })

      map.current.on('load', () => {
        setMapLoaded(true)
        addEventMarkers()
      })
    } catch (error) {
      console.error('Error loading Mapbox:', error)
    }
  }

  const addEventMarkers = () => {
    if (!map.current || !mapLoaded) return
    
    mapboxEvents.forEach((event, index) => {
      const el = document.createElement('div')
      el.className = 'w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors flex items-center justify-center text-white text-xs font-bold'
      el.textContent = (index + 1).toString()
      
      el.addEventListener('click', () => {
        setCurrentSwipeIndex(index)
        map.current?.flyTo({
          center: event.coordinates,
          zoom: 14
        })
      })

      const mapboxgl = require('mapbox-gl')
      new mapboxgl.Marker(el)
        .setLngLat(event.coordinates)
        .addTo(map.current)
    })
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

  const handleSwipeAction = (action: 'skip' | 'like' | 'add' | 'maybe') => {
    const currentEvent = mapboxEvents[currentSwipeIndex]
    
    setSwipeStats(prev => ({
      ...prev,
      viewed: prev.viewed + 1,
      ...(action === 'like' && { liked: prev.liked + 1 }),
      ...(action === 'add' && { added: prev.added + 1 })
    }))

    if (action === 'add') {
      setJourney(prev => [...prev, currentEvent])
    }

    // Move to next event
    if (currentSwipeIndex < mapboxEvents.length - 1) {
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

  const distances = ['2 miles', '5 miles', '10 miles', '25 miles']
  const categories = ['Tech', 'Social', 'Professional', 'Outdoors', 'Art']
  const timeframes = ['tonight', 'tomorrow', 'week', 'anytime']
  const trustLevels = ['all', '60+', '75+', '85+']

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'Tech': return '💻'
      case 'Social': return '🎉'
      case 'Professional': return '💼'
      case 'Outdoors': return '🥾'
      case 'Art': return '🎨'
      default: return '📍'
    }
  }

  const renderEventCard = (event: Event, isPast = false) => {
    const host = sampleUsers.find(u => u.id === event.hostId)
    if (!host) return null

    const spotsLeft = event.maxAttendees - event.attendeeCount

    return (
      <Link key={event.id} href={`/events/${event.id}`} className="block">
        <div className="card-soft hover:shadow-lg transition-shadow duration-200 cursor-pointer">
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
      </Link>
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
            { key: 'discover', label: 'Discover', count: mapboxEvents.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
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
                      onClick={() => handleExploreMode(!exploreMode)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${exploreMode ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
                    >
                      🔍 {exploreMode ? 'Exploring' : 'Explore'}
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
              </div>

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
                        value={filters.category} 
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
                  <h3 className="font-semibold text-slate-800 mb-4">📋 Discovery</h3>
                  {mapboxEvents[currentSwipeIndex] && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-800 mb-2">
                          {mapboxEvents[currentSwipeIndex].title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {mapboxEvents[currentSwipeIndex].description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                          <span>{mapboxEvents[currentSwipeIndex].time}</span>
                          <span>${mapboxEvents[currentSwipeIndex].price}</span>
                          <span>⭐ {mapboxEvents[currentSwipeIndex].trustScore}%</span>
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
                            onClick={() => handleSwipeAction('add')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg text-sm transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 text-center">
                        {swipeStats.viewed} viewed • {swipeStats.added} added to journey
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

                      {/* Journey Events */}
                      <div className="space-y-2">
                        {journey.map((event, index) => (
                          <div key={event.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h5 className="font-medium text-slate-800 text-sm">{event.title}</h5>
                                <p className="text-xs text-slate-500">{event.time} • {event.journeyTiming}min</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeFromJourney(event.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                        🚀 Start Your Journey
                      </button>
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