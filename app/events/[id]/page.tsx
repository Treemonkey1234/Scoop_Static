'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Layout from '../../../components/Layout'
import { sampleEvents, sampleUsers, attendEvent, getCurrentUser } from '../../../lib/sampleData'
import TrustBadge from '../../../components/TrustBadge'
import { 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'interested' | 'not-going' | null>(null)
  const [isLiked, setIsLiked] = useState(false)

  // Find the event
  const event = sampleEvents.find(e => e.id === eventId)
  if (!event) {
    return (
      <Layout>
        <div className="p-4">
          <div className="card-soft text-center py-12">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Event Not Found</h1>
            <p className="text-slate-600">The event you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    )
  }

  const host = sampleUsers.find(u => u.id === event.hostId)
  const spotsLeft = event.maxAttendees - event.attendeeCount
  const isPast = new Date(event.date) < new Date()

  const handleRSVP = (status: 'going' | 'interested' | 'not-going') => {
    setRsvpStatus(status)
    
    // If user selects "going", mark them as attending the event
    if (status === 'going') {
      const success = attendEvent(eventId)
      if (success) {
        // You could show a success message here
        console.log('Successfully RSVP\'d to event!')
      }
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  // Sample attendees
  const attendees = sampleUsers.slice(0, Math.min(6, event.attendeeCount))

  return (
    <Layout>
      <div className="p-4">
        {/* Event Image */}
        <div className="relative mb-6 -mx-4">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={400}
            height={250}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
            <span className="font-semibold text-slate-800">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </span>
          </div>
          {isPast && (
            <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full">
              <span className="text-white text-sm font-medium">Past Event</span>
            </div>
          )}
        </div>

        {/* Event Header */}
        <div className="card-soft mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image
                src={host?.avatar || ''}
                alt={host?.name || ''}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-slate-800">{host?.name}</h3>
                <p className="text-sm text-slate-500">Event Host</p>
              </div>
            </div>
            <TrustBadge score={host?.trustScore || 0} size="sm" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-3">{event.title}</h1>
          <p className="text-slate-700 mb-4">{event.description}</p>

          {/* Event Details */}
          <div className="space-y-3 text-slate-700">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-primary-500" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPinIcon className="w-5 h-5 text-primary-500 mt-0.5" />
              <div>
                <div>{event.location}</div>
                <div className="text-sm text-slate-500">{event.address}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-5 h-5 text-primary-500" />
              <span>
                {event.attendeeCount} attending
                {!isPast && spotsLeft > 0 && ` • ${spotsLeft} spots left`}
                {!isPast && spotsLeft === 0 && ' • Event Full'}
              </span>
            </div>
            {event.trustRequirement > 0 && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-primary-500 text-center">⭐</span>
                <span>Trust score {event.trustRequirement}+ required</span>
              </div>
            )}
          </div>

          {/* Event Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 bg-primary-50 text-primary-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* RSVP Section */}
        {!isPast && (
          <div className="card-soft mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">RSVP to this event</h2>
            
            {rsvpStatus && (
              <div className="mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  rsvpStatus === 'going' 
                    ? 'bg-trust-excellent/10 text-trust-excellent border border-trust-excellent/20'
                    : rsvpStatus === 'interested'
                    ? 'bg-trust-good/10 text-trust-good border border-trust-good/20'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {rsvpStatus === 'going' && '✓ You\'re going!'}
                  {rsvpStatus === 'interested' && '⭐ You\'re interested'}
                  {rsvpStatus === 'not-going' && '✗ Not attending'}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleRSVP('going')}
                disabled={spotsLeft === 0}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  rsvpStatus === 'going'
                    ? 'bg-trust-excellent text-white'
                    : spotsLeft === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {spotsLeft === 0 ? 'Event Full' : 'Going'}
              </button>
              <button
                onClick={() => handleRSVP('interested')}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  rsvpStatus === 'interested'
                    ? 'bg-trust-good text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Interested
              </button>
              <button
                onClick={() => handleRSVP('not-going')}
                className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  rsvpStatus === 'not-going'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Can't Go
              </button>
            </div>
          </div>
        )}

        {/* Attendees */}
        <div className="card-soft mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Attendees ({event.attendeeCount})
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <Image
                  src={attendee.avatar}
                  alt={attendee.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-800 truncate">{attendee.name}</h4>
                  <div className="flex items-center space-x-1">
                    <TrustBadge score={attendee.trustScore} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {event.attendeeCount > 6 && (
            <div className="mt-3 text-center">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all {event.attendeeCount} attendees
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors duration-200"
              >
                {isLiked ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-slate-600 hover:text-primary-500 transition-colors duration-200">
                <ShareIcon className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
            
            <button className="flex items-center space-x-1 text-slate-500 hover:text-orange-500 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6v1a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Flag</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 