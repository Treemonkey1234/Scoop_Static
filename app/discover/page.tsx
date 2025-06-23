'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { getCurrentUser } from '@/lib/sampleData'
import Link from 'next/link'
import {
  MapPinIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ListBulletIcon,
  MapIcon
} from '@heroicons/react/24/outline'

// Discovery-specific events for the map
const discoveryEvents = [
  {
    id: 'disc-1',
    title: 'Tech Meetup Phoenix',
    description: 'JavaScript frameworks discussion and networking',
    hostId: '2',
    date: 'Tomorrow',
    time: '7:00 PM - 9:00 PM',
    location: 'WeWork Central',
    address: '2 N Central Ave, Phoenix, AZ',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    maxAttendees: 50,
    attendeeCount: 12,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 75,
    tags: ['JavaScript', 'Networking', 'Tech'],
    distance: 0.8,
    interested: 87,
    mapPosition: { x: 15, y: 10 }
  },
  {
    id: 'disc-2',
    title: 'Coffee & Code Sunday',
    description: 'Casual coding session over coffee',
    hostId: '1',
    date: 'This Sunday',
    time: '10:00 AM - 2:00 PM',
    location: 'Local Coffee Co',
    address: '123 Coffee St, Phoenix, AZ',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    maxAttendees: 20,
    attendeeCount: 8,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 50,
    tags: ['Coffee', 'Coding', 'Casual'],
    distance: 2.1,
    interested: 32,
    mapPosition: { x: 55, y: 15 }
  },
  {
    id: 'disc-3',
    title: 'Weekend Hiking Group',
    description: 'Explore South Mountain trails together',
    hostId: '3',
    date: 'Saturday',
    time: '6:00 AM - 11:00 AM',
    location: 'South Mountain Park',
    address: 'South Mountain Park, Phoenix, AZ',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    maxAttendees: 15,
    attendeeCount: 6,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 60,
    tags: ['Hiking', 'Outdoor', 'Exercise'],
    distance: 8.5,
    interested: 45,
    mapPosition: { x: 25, y: 65 }
  },
  {
    id: 'disc-4',
    title: 'Art Gallery Opening',
    description: 'Contemporary art exhibition opening night',
    hostId: '4',
    date: 'Friday',
    time: '6:00 PM - 10:00 PM',
    location: 'Phoenix Art Museum',
    address: '1625 N Central Ave, Phoenix, AZ',
    category: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    maxAttendees: 100,
    attendeeCount: 23,
    price: 15,
    isPrivate: true,
    isPast: false,
    trustRequirement: 80,
    tags: ['Art', 'Culture', 'Private'],
    distance: 0.3,
    interested: 18,
    mapPosition: { x: 70, y: 25 }
  }
]

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'discover'>('discover')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedEvent, setSelectedEvent] = useState(discoveryEvents[0])
  const [filters, setFilters] = useState({
    distance: '5mi',
    category: '',
    time: 'week',
    trustLevel: '50+',
    attendees: '5+'
  })

  const currentUser = getCurrentUser()

  const categories = ['Tech', 'Social', 'Professional', 'Sports', 'Art']
  const distances = ['5mi', '10mi', '25mi']
  const timeframes = ['today', 'week', 'month', 'anytime']

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Discover Events</h1>
          <button className="p-2 rounded-xl bg-primary-500 text-white">
            <UserGroupIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Event Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
          <Link
            href="/events"
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'upcoming' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            📋 Upcoming
          </Link>
          <Link
            href="/events"
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'past' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            📚 Past
          </Link>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'discover' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            🗺️ Discover
          </button>
        </div>

        {/* Map View Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapIcon className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-800">Map View • Phoenix, AZ</span>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ListBulletIcon className="w-4 h-4" />
            <span>List View</span>
          </button>
        </div>

        {/* Interactive Map */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="relative h-64 p-4">
            {/* Map markers */}
            {discoveryEvents.map((event, index) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  selectedEvent.id === event.id ? 'scale-125 z-10' : 'hover:scale-110'
                }`}
                style={{
                  left: `${event.mapPosition.x}%`,
                  top: `${event.mapPosition.y}%`
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                  event.category === 'Tech' ? 'bg-blue-500' :
                  event.category === 'Social' ? 'bg-green-500' :
                  event.category === 'Sports' ? 'bg-orange-500' :
                  event.category === 'Art' ? 'bg-purple-500' : 'bg-slate-500'
                }`}>
                  📍
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white rounded-lg shadow-lg text-xs font-medium text-slate-800 whitespace-nowrap">
                  {event.title}
                </div>
              </button>
            ))}

            {/* You are here marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg relative">
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-slate-800 whitespace-nowrap">
                  🚩 YOU ARE HERE
                </div>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="btn-secondary text-xs">
                  <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
                  Search Area
                </button>
                <button className="btn-secondary text-xs">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  Locate Me
                </button>
                <button className="btn-secondary text-xs">
                  <FunnelIcon className="w-3 h-3 mr-1" />
                  Filters
                </button>
                <button className="btn-secondary text-xs">
                  <ArrowPathIcon className="w-3 h-3 mr-1" />
                  Refresh
                </button>
              </div>
              <div className="text-xs text-slate-600 bg-white px-2 py-1 rounded-lg">
                📏 Scale: 5 miles • 🎯 Showing {discoveryEvents.length} events
              </div>
            </div>
          </div>
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="card-soft">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-800">Selected Event</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">{selectedEvent.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{selectedEvent.distance} miles away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>{selectedEvent.attendeeCount} going</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Trust Required: {selectedEvent.trustRequirement}+</span>
                <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                  {selectedEvent.category}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary text-sm flex-1">✅ Going</button>
                <button className="btn-secondary text-sm flex-1">❓ Maybe</button>
                <Link href={`/events/${selectedEvent.id}`} className="btn-secondary text-sm">
                  ℹ️ More Info
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="card-soft">
          <h3 className="font-semibold text-slate-800 mb-4">🔍 Filters & Search</h3>
          
          <div className="space-y-4">
            {/* Distance */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Distance</label>
              <div className="flex space-x-2">
                {distances.map(distance => (
                  <button
                    key={distance}
                    onClick={() => setFilters(prev => ({ ...prev, distance }))}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filters.distance === distance
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    📏 {distance}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      category: prev.category === category ? '' : category 
                    }))}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filters.category === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category === 'Tech' ? '💻' : 
                     category === 'Social' ? '🎉' :
                     category === 'Professional' ? '💼' :
                     category === 'Sports' ? '🏃' : '🎨'} {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Time</label>
              <div className="flex space-x-2">
                {timeframes.map(time => (
                  <button
                    key={time}
                    onClick={() => setFilters(prev => ({ ...prev, time }))}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filters.time === time
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {time === 'today' ? '🔥 Today' :
                     time === 'week' ? '📅 This Week' :
                     time === 'month' ? '📆 This Month' : '🎯 Anytime'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Events */}
        <div className="card-soft">
          <h3 className="font-semibold text-slate-800 mb-4">🏆 Trending Events</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">🔥 Most Popular This Week:</h4>
              <div className="space-y-2">
                {discoveryEvents.sort((a, b) => b.interested - a.interested).slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700">• {event.title}</span>
                    <span className="text-xs text-slate-500">({event.interested} interested)</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">📍 Closest to You:</h4>
              <div className="space-y-2">
                {discoveryEvents.sort((a, b) => a.distance - b.distance).slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700">• {event.title}</span>
                    <span className="text-xs text-slate-500">
                      ({event.distance} miles) - {event.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3">
          <button className="btn-primary">🎯 Find Events Near Me</button>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/events" className="btn-secondary text-center">📅 View My Calendar</Link>
            <button className="btn-secondary">🔔 Set Notifications</button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 