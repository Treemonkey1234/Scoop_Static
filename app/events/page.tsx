'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import { sampleUsers, sampleEvents } from '@/lib/sampleData'
import { 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  ShareIcon,
  HeartIcon,
  GlobeAltIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'discover'>('upcoming')
  const [likedEvents, setLikedEvents] = useState<{[key: string]: boolean}>({})
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

  const getEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const isUpcoming = date > now
    
    return {
      isUpcoming,
      formatted: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const upcomingEvents = sampleEvents.filter(event => getEventDate(event.date).isUpcoming)
  const pastEvents = sampleEvents.filter(event => !getEventDate(event.date).isUpcoming)

  const renderEventCard = (event: any, isPast = false) => {
    const host = sampleUsers.find(u => u.id === event.hostId)
    if (!host) return null

    const dateInfo = getEventDate(event.date)
    const spotsLeft = event.maxAttendees - event.attendeeCount

    return (
      <div key={event.id} className="card-soft">
        {/* Event Image */}
        <div className="relative mb-4 -mx-6 -mt-6">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={400}
            height={200}
            className={`w-full h-48 object-cover rounded-t-2xl ${isPast ? 'grayscale opacity-75' : ''}`}
          />
          
          {/* Event Badges */}
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
            
            {/* Event Category Badge */}
            <div className="bg-teal-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{event.category || 'Social Event'}</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-slate-800">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </span>
          </div>

          {isPast && (
            <div className="absolute inset-0 bg-black/20 rounded-t-2xl flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-slate-800">Event Ended</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Header */}
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
              <h3 className="font-semibold text-slate-800">{host.name}</h3>
              <p className="text-sm text-slate-500">hosting</p>
            </div>
          </div>
          <TrustBadge score={host.trustScore} size="sm" />
        </div>

        {/* Event Details */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h4>
          <p className="text-slate-600 mb-3 line-clamp-2">{event.description}</p>
          
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-cyan-500" />
              <span>{dateInfo.formatted} at {event.time}</span>
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
            {event.trustRequirement > 0 && (
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 text-cyan-500 text-center">⭐</span>
                <span>Trust score {event.trustRequirement}+ required</span>
              </div>
            )}
          </div>

          {/* Event Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {event.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-cyan-50 text-cyan-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* RSVP Status */}
        {event.rsvpStatus && (
          <div className="mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              event.rsvpStatus === 'going' 
                ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                : event.rsvpStatus === 'interested'
                ? 'bg-teal-100 text-teal-700 border border-teal-200'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {event.rsvpStatus === 'going' && '✓ You\'re going'}
              {event.rsvpStatus === 'interested' && '⭐ You\'re interested'}
              {event.rsvpStatus === 'not-going' && '✗ Not attending'}
            </div>
          </div>
        )}

        {/* Event Actions */}
        <div className="flex items-center space-x-3">
          {isPast && event.rsvpStatus === 'going' ? (
            // Show review button for past events the user attended
            <Link
              href={`/create-post?event=${event.id}`}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-2 px-4 rounded-xl text-center font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <StarIcon className="w-4 h-4" />
              <span>Leave your review</span>
            </Link>
          ) : (
            <Link
              href={`/events/${event.id}`}
              className="flex-1 btn-primary text-center py-2"
            >
              {isPast ? 'View Details' : 'View & RSVP'}
            </Link>
          )}
          
          <button
            onClick={() => handleLike(event.id)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
          >
            {likedEvents[event.id] ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-slate-500" />
            )}
          </button>
          <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200">
            <ShareIcon className="w-5 h-5 text-slate-500" />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleFlag('event', event.id, event.title)
            }}
            className="p-2 rounded-xl hover:bg-orange-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-slate-500 hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6v1a2 2 0 01-2-2H5a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Events</h1>
          <p className="text-slate-600">Discover and join amazing events in your community</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
            { key: 'past', label: 'Past', count: pastEvents.length },
            { key: 'discover', label: 'Discover', count: '∞' }
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
                pastEvents.map(event => renderEventCard(event, true))
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
              <div className="card-soft text-center py-8">
                <GlobeAltIcon className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Interactive Map Coming Soon</h3>
                <p className="text-slate-600 mb-4">Discover events near you with our interactive map</p>
                <Link href="/discover" className="btn-primary">
                  Open Map View
                </Link>
              </div>
              
              {/* All Events for Discovery */}
              {sampleEvents.map(event => renderEventCard(event))}
            </div>
          )}
        </div>

        {/* Load More */}
        {(activeTab !== 'discover') && (
          <div className="flex justify-center py-8">
            <button className="btn-secondary">
              Load More Events
            </button>
          </div>
        )}
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={flagModal.isOpen}
        onClose={closeFlagModal}
        contentType={flagModal.contentType}
        contentId={flagModal.contentId}
        contentTitle={flagModal.contentTitle}
      />
    </Layout>
  )
} 