'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { getCurrentUser, getAllEvents, Event } from '@/lib/sampleData'
import { 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  PencilIcon,
  BellIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Get all events and filter for ones created by the current user
    const allEvents = getAllEvents()
    const userEvents = allEvents.filter(event => event.hostId === user.id)
    
    // Sort events by date
    const sortedEvents = userEvents.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    setEvents(sortedEvents)
  }, [])

  const getEventStatus = (event: Event) => {
    const eventDate = new Date(event.date)
    const now = new Date()
    const diffTime = eventDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

    if (diffTime < 0) return { text: 'Ended', color: 'text-slate-500' }
    if (diffHours < 24) return { text: `${diffHours}hrs until start`, color: 'text-cyan-600' }
    return { text: `${diffDays} days until start`, color: 'text-cyan-600' }
  }

  const groupEventsByDate = (events: Event[]) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return {
      today: events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === now.toDateString()
      }),
      tomorrow: events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === tomorrow.toDateString()
      }),
      nextWeek: events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate > tomorrow && eventDate <= nextWeek
      }),
      future: events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate > nextWeek
      })
    }
  }

  const groupedEvents = groupEventsByDate(events)

  const renderEventCard = (event: Event) => {
    const status = getEventStatus(event)
    const spotsLeft = event.maxAttendees - event.attendeeCount

    return (
      <div key={event.id} className="pl-6 border-l-2 border-slate-200 pb-6 last:pb-0">
        <div className="relative">
          {/* Status Dot */}
          <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-cyan-500" />
          
          <div className="card-soft">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-800">{event.title}</h3>
              <span className={`text-sm ${status.color}`}>{status.text}</span>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-4 h-4 text-cyan-500" />
                <span>{event.attendeeCount}/{event.maxAttendees} Attending</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-cyan-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-cyan-500" />
                <span>{event.time}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                onClick={() => window.location.href = `/events/${event.id}`}
              >
                <UserGroupIcon className="w-4 h-4" />
                <span>Manage Attendees</span>
              </button>
              <button 
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                onClick={() => window.location.href = `/events/${event.id}/edit`}
              >
                <PencilIcon className="w-4 h-4" />
                <span>Edit Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">My Events Timeline</h1>
          <p className="text-slate-600">Manage your created events</p>
        </div>

        {events.length === 0 ? (
          <div className="card-soft text-center py-12">
            <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Events Created</h3>
            <p className="text-slate-500 mb-6">You haven't created any events yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedEvents.today.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">TODAY</h2>
                <div className="space-y-4">
                  {groupedEvents.today.map(renderEventCard)}
                </div>
              </div>
            )}

            {groupedEvents.tomorrow.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">TOMORROW</h2>
                <div className="space-y-4">
                  {groupedEvents.tomorrow.map(renderEventCard)}
                </div>
              </div>
            )}

            {groupedEvents.nextWeek.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">NEXT WEEK</h2>
                <div className="space-y-4">
                  {groupedEvents.nextWeek.map(renderEventCard)}
                </div>
              </div>
            )}

            {groupedEvents.future.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">FUTURE EVENTS</h2>
                <div className="space-y-4">
                  {groupedEvents.future.map(renderEventCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
} 