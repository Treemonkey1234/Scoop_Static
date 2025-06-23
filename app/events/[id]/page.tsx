'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { Event, Review, getCurrentUser, getAllEvents, getAllReviews, sampleUsers } from '@/lib/sampleData'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon,
  StarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChatBubbleLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

export default function EventDetailsPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allEvents = getAllEvents()
    const foundEvent = allEvents.find(e => e.id === params.id)
    const user = getCurrentUser()
    const allReviews = getAllReviews().filter(r => r.isEventReview && r.eventId === params.id)
    
    setEvent(foundEvent || null)
    setCurrentUser(user)
    setReviews(allReviews)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-64 bg-slate-200 rounded-2xl mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!event) {
    return (
      <Layout>
        <div className="p-4">
          <div className="card-soft text-center py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Event Not Found</h2>
            <p className="text-slate-600 mb-6">This event may have been removed or you may not have permission to view it.</p>
            <Link href="/events" className="btn-primary">
              Back to Events
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const host = sampleUsers.find(u => u.id === event.hostId)
  if (!host) return null

  const spotsLeft = event.maxAttendees - event.attendeeCount
  const userAttended = event.attendees?.includes(currentUser?.id)
  const hasUserReviewed = reviews.some(review => review.reviewerId === currentUser?.id)
  const showReviewButton = event.isPast && userAttended && !hasUserReviewed

  return (
    <Layout>
      <div className="p-4">
        {/* Event Image */}
        <div className="relative mb-6">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={800}
            height={400}
            className={`w-full h-64 object-cover rounded-2xl ${event.isPast ? 'grayscale opacity-75' : ''}`}
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

          {event.isPast && (
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-slate-800">Event Ended</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Image
              src={host.avatar}
              alt={host.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <Link href={`/user/${host.id}`} className="font-medium text-slate-800 hover:text-cyan-600">
                {host.name}
              </Link>
              <p className="text-sm text-slate-500">hosting</p>
            </div>
          </div>
          <TrustBadge score={host.trustScore} size="md" />
        </div>

        {/* Event Details */}
        <div className="card-soft mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-3">{event.title}</h1>
          <p className="text-slate-600 mb-6">{event.description}</p>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-cyan-500" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-5 h-5 text-cyan-500" />
              <div>
                <div>{event.location}</div>
                <div className="text-slate-500">{event.address}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-5 h-5 text-cyan-500" />
              <span>
                {event.attendeeCount} attending
                {!event.isPast && spotsLeft > 0 && ` • ${spotsLeft} spots left`}
              </span>
            </div>
            {event.trustRequirement > 0 && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-cyan-500 text-center">⭐</span>
                <span>Trust score {event.trustRequirement}+ required</span>
              </div>
            )}
          </div>

          {/* Event Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-8">
          {showReviewButton ? (
            <Link
              href={`/create-post?event=${event.id}`}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-4 rounded-xl text-center font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <StarIcon className="w-5 h-5" />
              <span>Write a Review</span>
            </Link>
          ) : !event.isPast ? (
            <button className="flex-1 btn-primary py-3">
              RSVP to Event
            </button>
          ) : null}
          
          <button className="btn-secondary">
            <ShareIcon className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Reviews Section */}
        {event.isPast && reviews.length > 0 && (
          <div className="card-soft">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Event Reviews ({reviews.length})
            </h2>
            <div className="space-y-6">
              {reviews.map(review => {
                const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
                if (!reviewer) return null

                return (
                  <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <Image
                        src={reviewer.avatar}
                        alt={reviewer.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <Link href={`/user/${reviewer.id}`} className="font-medium text-slate-800 hover:text-cyan-600">
                          {reviewer.name}
                        </Link>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-slate-500">
                            {new Date(review.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-cyan-600">
                            {review.votes > 0 ? `+${review.votes}` : review.votes} votes
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600">{review.content}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Link
                        href={`/comments/${review.id}`}
                        className="flex items-center space-x-2 text-slate-600 hover:text-cyan-600 transition-colors duration-200"
                      >
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        <span className="text-sm">Comment</span>
                      </Link>
                      <button className="flex items-center space-x-2 text-slate-600 hover:text-cyan-600 transition-colors duration-200">
                        <ShareIcon className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 