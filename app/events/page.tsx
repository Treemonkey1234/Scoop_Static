'use client'

import React, { useState, useEffect } from 'react'
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
  FlagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'discover'>('upcoming')
  const [likedEvents, setLikedEvents] = useState<{[key: string]: boolean}>({})
  const [startX, setStartX] = useState(0)
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

  // Load events, reviews and current user on component mount
  useEffect(() => {
    const allEvents = getAllEvents()
    const allReviews = getAllReviews()
    const user = getCurrentUser()
    setEvents(allEvents)
    setReviews(allReviews)
    setCurrentUser(user)
  }, [])

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

  // Tab order for swipe navigation
  const tabOrder = ['upcoming', 'past', 'discover']

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX - e.changedTouches[0].clientX
    const currentIndex = tabOrder.indexOf(activeTab)

    if (Math.abs(diff) < 50) return // Minimum swipe distance

    if (diff > 0 && currentIndex < tabOrder.length - 1) {
      // Swipe left - next tab
      setActiveTab(tabOrder[currentIndex + 1] as any)
    } else if (diff < 0 && currentIndex > 0) {
      // Swipe right - previous tab
      setActiveTab(tabOrder[currentIndex - 1] as any)
    }
  }

  // Filter events based on current user and status
  const upcomingEvents = events.filter(event => !event.isPast)
  const pastEvents = events.filter(event => 
    event.isPast && 
    event.attendees?.includes(currentUser?.id) // Only show past events the user attended
  )

  // Check if user has reviewed an event
  const hasUserReviewedEvent = (eventId: string) => {
    return reviews.some(review => 
      review.isEventReview && 
      review.eventId === eventId && 
      review.reviewerId === currentUser?.id
    )
  }

  const renderEventCard = (event: Event, isPast = false) => {
    const host = sampleUsers.find(u => u.id === event.hostId)
    if (!host) return null

    const spotsLeft = event.maxAttendees - event.attendeeCount
    const hasReviewed = isPast && hasUserReviewedEvent(event.id)

    return (
      <Link key={event.id} href={`/events/${event.id}`} className="block">
        <div className="card-soft hover:shadow-lg transition-shadow duration-200 cursor-pointer">
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
                <span className="text-sm font-medium">{event.category}</span>
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
                <Link href={`/user/${host.id}`} className="font-medium text-slate-800 hover:text-cyan-600">
                  {host.name}
                </Link>
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

          {/* Event Actions */}
          <div className="flex items-center space-x-3">
            {isPast ? (
              hasReviewed ? (
                // Show view details if already reviewed
                <Link
                  href={`/events/${event.id}`}
                  className="flex-1 btn-primary text-center py-2"
                >
                  View Details
                </Link>
              ) : (
                // Show review button if not reviewed yet
                <Link
                  href={`/create-post?event=${event.id}`}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-2 px-4 rounded-xl text-center font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <StarIcon className="w-4 h-4" />
                  <span>Review?</span>
                </Link>
              )
            ) : (
              <Link
                href={`/events/${event.id}`}
                className="flex-1 btn-primary text-center py-2"
              >
                View & RSVP
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
              <FlagIcon className="w-5 h-5 text-orange-500" />
            </button>
          </div>
        </div>
      </Link>
    )
  }

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
            { key: 'discover', label: 'Discover', count: events.length }
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

        {/* Content - Swipeable */}
        <div
          className="space-y-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe instruction for mobile */}
          <div className="text-center text-sm text-slate-500 mb-4 md:hidden">
            ← Swipe to navigate between tabs →
          </div>

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
            <>
              {events.length > 0 ? (
                events.map(event => renderEventCard(event))
              ) : (
                <div className="card-soft text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No events found</h3>
                  <p className="text-slate-500">Try adjusting your search filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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