'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { sampleUsers } from '@/lib/sampleData'
import { 
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  TagIcon,
  ShieldCheckIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export default function CreateEventPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    quickDate: '',
    date: '',
    startTime: '',
    endTime: '',
    venueName: '',
    address: '',
    eventType: 'public',
    trustRequirement: '50',
    maxAttendees: '',
    invitedFriends: [] as string[]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Categories from ASCII design
  const categories = [
    { id: 'tech', label: '💻 Tech', selected: false },
    { id: 'social', label: '🎉 Social', selected: false },
    { id: 'professional', label: '💼 Professional', selected: false },
    { id: 'sports', label: '🏃 Sports', selected: false }
  ]

  // Quick date options from ASCII design
  const quickDates = [
    { id: 'today', label: '📅 Today' },
    { id: 'tomorrow', label: '📅 Tomorrow' },
    { id: 'nextweek', label: '📅 Next Week' },
    { id: 'custom', label: '📅 Custom' }
  ]

  // Event types from ASCII design
  const eventTypes = [
    { id: 'public', label: '🌍 Public' },
    { id: 'private', label: '🔒 Private' },
    { id: 'friends', label: '👥 Friends Only' }
  ]

  // Trust requirements from ASCII design
  const trustRequirements = [
    { id: '50', label: '50+' },
    { id: '70', label: '70+' },
    { id: '80', label: '80+' },
    { id: '90', label: '90+' },
    { id: 'none', label: 'No Requirement' }
  ]

  // Suggested friends from ASCII design
  const suggestedFriends = [
    { id: '2', name: 'Jessica Wong', trustScore: 95, note: 'Tech enthusiast' },
    { id: '3', name: 'David Kim', trustScore: 95, note: 'Frontend developer' },
    { id: '1', name: 'Sarah Chen', trustScore: 89, note: 'React specialist' },
    { id: '4', name: 'Alex Martinez', trustScore: 92, note: 'JavaScript expert' }
  ]

  const handleQuickDateSelect = (dateId: string) => {
    setFormData(prev => ({ ...prev, quickDate: dateId }))
    
    const today = new Date()
    let selectedDate = ''
    
    switch(dateId) {
      case 'today':
        selectedDate = today.toISOString().split('T')[0]
        break
      case 'tomorrow':
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        selectedDate = tomorrow.toISOString().split('T')[0]
        break
      case 'nextweek':
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)
        selectedDate = nextWeek.toISOString().split('T')[0]
        break
    }
    
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }))
    }
  }

  const handleFriendToggle = (friendId: string) => {
    setFormData(prev => ({
      ...prev,
      invitedFriends: prev.invitedFriends.includes(friendId)
        ? prev.invitedFriends.filter(id => id !== friendId)
        : [...prev.invitedFriends, friendId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Redirect to events page
    router.push('/events')
  }

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01 ${formData.startTime}`)
      const end = new Date(`2000-01-01 ${formData.endTime}`)
      const diff = end.getTime() - start.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      return hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : ''
    }
    return ''
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ❌ Cancel
          </button>
          <h1 className="text-xl font-bold text-slate-800">Create Event</h1>
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.category || !formData.description}
            className="text-green-600 hover:text-green-700 font-medium disabled:text-slate-400"
          >
            ✅ Create
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Basics */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📋 EVENT BASICS</h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Tech Meetup Phoenix - React Best Practices"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Event Title</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Category:</p>
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.category === category.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
              📅 DATE & TIME
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Quick Select:</p>
                <div className="flex space-x-2 mb-4">
                  {quickDates.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleQuickDateSelect(option.id)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.quickDate === option.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    📅 Date:
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      🕰️ Start Time:
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      🕰️ End Time:
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {formData.date && formData.startTime && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <span className="font-medium">Timezone:</span> Phoenix (MST) 
                  {calculateDuration() && (
                    <span className="ml-4">
                      <span className="font-medium">Duration:</span> {calculateDuration()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
              📍 LOCATION
            </h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                  placeholder="WeWork Central Phoenix"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Venue Name</p>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="1 E Washington St, Phoenix, AZ 85004"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Address</p>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors duration-200"
                >
                  📍 Use Current Location
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors duration-200"
                >
                  🗺️ Search Map
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors duration-200"
                >
                  📋 Recent Venues
                </button>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">✍️ EVENT DESCRIPTION</h3>
            
            <div className="space-y-4">
              <p className="text-slate-600">Tell people what this event is about...</p>
              
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={`Join us for an exciting evening of React development discussion! We'll cover best practices, new features, and have open networking time. Perfect for developers of all skill levels.

Agenda:
• 7:00-7:30 PM: Networking & refreshments
• 7:30-8:30 PM: React best practices presentation
• 8:30-9:00 PM: Q&A and more networking`}
                rows={8}
                className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                maxLength={1000}
                required
              />
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{formData.description.length}/1000 characters • Be detailed and informative</span>
              </div>
            </div>
          </div>

          {/* Privacy & Access */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🔐 PRIVACY & ACCESS</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Event Type:</p>
                <div className="flex space-x-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, eventType: type.id }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.eventType === type.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Trust Score Requirement:</p>
                <div className="flex space-x-2">
                  {trustRequirements.map((req) => (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, trustRequirement: req.id }))}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.trustRequirement === req.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {req.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Attendees: (Max: 200)
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  placeholder="25"
                  min="1"
                  max="200"
                  className="w-32 p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Invitations */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-primary-500" />
              👥 INVITATIONS (Optional)
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Invite specific friends: Search by name..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">📋 SUGGESTED FRIENDS:</h4>
                <div className="space-y-2">
                  {suggestedFriends.map((friend) => (
                    <label
                      key={friend.id}
                      className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.invitedFriends.includes(friend.id)}
                        onChange={() => handleFriendToggle(friend.id)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800">{friend.name}</span>
                          <span className="text-sm text-slate-500">(Trust: {friend.trustScore})</span>
                        </div>
                        <p className="text-sm text-slate-600">{friend.note}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors duration-200"
                >
                  📲 Import from Contacts
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors duration-200"
                >
                  👥 Browse All Friends
                </button>
              </div>
            </div>
          </div>

          {/* Event Requirements */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">⚠️ EVENT REQUIREMENTS</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-slate-700">Your Trust Score: 95 (Meets requirement for event creation)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-slate-700">Verified location provided</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-slate-700">Event follows community guidelines</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-amber-500">⚠️</span>
                <span className="text-slate-700">As host, you're responsible for event success and safety</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="card-soft">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category || !formData.description}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Event...</span>
                </div>
              ) : (
                '✅ Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 