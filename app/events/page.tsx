'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import { sampleUsers, getAllEvents, pastEvents, getCurrentUser, getAllReviews } from '@/lib/sampleData'
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
  ChatBubbleLeftIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'discover'>('upcoming')
  const [likedEvents, setLikedEvents] = useState<{[key: string]: boolean}>({})
  const [startX, setStartX] = useState(0)
  const [events, setEvents] = useState<any[]>([])
  const currentUser = getCurrentUser()
  const allReviews = getAllReviews()
  
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

  // Load events on component mount
  React.useEffect(() => {
    const allEvents = getAllEvents()
    setEvents(allEvents)
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

  // Filter events based on active tab
  const filteredEvents = activeTab === 'past' ? pastEvents : events.filter(event => !event.isPast)

  // Get event reviews
  const getEventReviews = (eventId: string) => {
    return allReviews.filter(review => review.eventId === eventId)
  }

  // Check if user has attended event
  const hasAttendedEvent = (eventId: string) => {
    const event = pastEvents.find(e => e.id === eventId)
    // For now, we'll assume if they're in the attendeeCount, they attended
    // In a real app, this would check a proper attendees list
    return event?.attendeeCount ? event.attendeeCount > 0 : false
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Events</h1>
          <Link 
            href="/create-event"
            className="btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          >
            Create Event
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-4 text-sm font-medium ${
              activeTab === 'upcoming'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-4 text-sm font-medium ${
              activeTab === 'past'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-4 px-4 text-sm font-medium ${
              activeTab === 'discover'
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discover
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const host = sampleUsers.find(u => u.id === event.hostId)
            const isLiked = likedEvents[event.id]
            const eventReviews = getEventReviews(event.id)
            const canReview = event.isPast && hasAttendedEvent(event.id)

            if (!host) return null

            return (
              <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Event Image */}
                <div className="relative h-48">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/user/${host.id}`}
                        className="text-sm text-white hover:underline flex items-center space-x-1"
                      >
                        <span>by {host.name}</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <ClockIcon className="w-4 h-4 ml-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <UsersIcon className="w-4 h-4" />
                      <span>{event.attendeeCount} / {event.maxAttendees} attending</span>
                    </div>
                    {event.trustRequirement > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <StarIcon className="w-4 h-4" />
                        <span>Trust Score {event.trustRequirement}+ required</span>
                      </div>
                    )}
                  </div>

                  {/* Event Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Reviews Section for Past Events */}
                  {event.isPast && (
                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-700">Event Reviews</h4>
                        {canReview && (
                          <Link
                            href={`/create-post?type=event&eventId=${event.id}`}
                            className="text-xs text-cyan-600 hover:text-cyan-700"
                          >
                            Write Review
                          </Link>
                        )}
                      </div>
                      {eventReviews.length > 0 ? (
                        <div className="space-y-2">
                          {eventReviews.map(review => {
                            const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
                            return (
                              <div key={review.id} className="text-sm">
                                <Link href={`/user/${reviewer?.id}`} className="font-medium text-slate-700 hover:text-cyan-600">
                                  {reviewer?.name}
                                </Link>
                                <p className="text-slate-600 line-clamp-2">{review.content}</p>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No reviews yet</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(event.id)}
                        className="text-slate-600 hover:text-cyan-600"
                      >
                        {isLiked ? (
                          <HeartIconSolid className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5" />
                        )}
                      </button>
                      <Link
                        href={`/events/${event.id}`}
                        className="text-slate-600 hover:text-cyan-600"
                      >
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleFlag('event', event.id, event.title)}
                        className="text-slate-600 hover:text-red-600"
                      >
                        <FlagIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Flag Modal */}
        <FlagModal
          isOpen={flagModal.isOpen}
          onClose={closeFlagModal}
          contentType={flagModal.contentType}
          contentId={flagModal.contentId}
          contentTitle={flagModal.contentTitle}
        />
      </div>
    </Layout>
  )
} 