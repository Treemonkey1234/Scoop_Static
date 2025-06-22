'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { 
  BellIcon,
  ChevronLeftIcon,
  CogIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  TrophyIcon,
  ChartBarIcon,
  EyeIcon,
  TrashIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function NotificationsPage() {
  const router = useRouter()
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'review',
      title: 'NEW REVIEW',
      time: '5 minutes ago',
      content: 'Jessica Wong reviewed you in "Professional" category',
      details: '"Amazing collaboration on the React project!"',
      subtext: 'Trust Impact: +2 points • Community Validation: 95%',
      isRead: false,
      actions: []
    },
    {
      id: '2',
      type: 'friend',
      title: 'FRIEND REQUEST',
      time: '12 minutes ago',
      content: 'Alex Martinez wants to connect with you',
      details: 'Trust Score: 87 • 12 mutual friends • Phoenix, AZ',
      subtext: '',
      isRead: false,
      actions: ['Accept', 'Decline', 'View Profile']
    },
    {
      id: '3',
      type: 'event',
      title: 'EVENT UPDATE',
      time: '25 minutes ago',
      content: '"Tech Meetup Phoenix" has been updated by David Kim',
      details: '📅 Date changed: Dec 22 → Dec 23, 7:00 PM',
      subtext: '📍 Location: WeWork Central Phoenix',
      isRead: false,
      actions: ['Update Calendar', "Can't Attend", 'Comment']
    },
    {
      id: '4',
      type: 'trust',
      title: 'TRUST SCORE UPDATE',
      time: '1 hour ago',
      content: 'Your trust score increased from 93 to 95!',
      details: '🎉 Reason: Positive community validation on recent reviews',
      subtext: 'New Trust Level: "Highly Trusted" • Unlocked: Premium Events',
      isRead: false,
      actions: ['View Details', 'Share Achievement']
    },
    {
      id: '5',
      type: 'community',
      title: 'COMMUNITY UPDATE',
      time: '2 hours ago',
      content: 'New community guidelines are now in effect',
      details: 'Enhanced trust verification • Improved review validation',
      subtext: '',
      isRead: false,
      actions: ['Read Guidelines', 'Acknowledge']
    },
    {
      id: '6',
      type: 'friend',
      title: 'FRIEND REQUEST',
      time: '3 hours ago',
      content: 'Sarah Chen wants to connect with you',
      details: 'Trust Score: 92 • 8 mutual friends • Tempe, AZ',
      subtext: '',
      isRead: false,
      actions: ['Accept', 'Decline', 'View Profile']
    },
    {
      id: '7',
      type: 'event',
      title: 'EVENT REMINDER',
      time: '4 hours ago',
      content: '"Weekly Networking Mixer" starts in 24 hours',
      details: '📅 Tomorrow, Dec 21 at 6:00 PM',
      subtext: '📍 The Churchill, Phoenix • 23 attending',
      isRead: true,
      actions: ['Add to Calendar', 'Get Directions', 'Chat']
    },
    {
      id: '8',
      type: 'badge',
      title: 'TRUST MILESTONE',
      time: 'Yesterday',
      content: "Congratulations! You've reached 50 verified reviews",
      details: '🏆 Badge Earned: "Community Contributor"',
      subtext: 'Reward: Early access to premium features',
      isRead: true,
      actions: ['View Badge', 'See Stats', 'Share']
    },
    {
      id: '9',
      type: 'review',
      title: 'REVIEW ALERT',
      time: 'Yesterday',
      content: 'Your review of "Emma Davis" has been validated by the community',
      details: '94% community agreement • Trust impact confirmed',
      subtext: 'Both trust scores updated • Thank you for honest feedback!',
      isRead: true,
      actions: ['View Impact', 'See Validators']
    }
  ])

  const filters = [
    { id: 'all', label: '📋 All', count: notifications.length },
    { id: 'review', label: '⭐ Reviews', count: notifications.filter(n => n.type === 'review').length },
    { id: 'friend', label: '👥 Friends', count: notifications.filter(n => n.type === 'friend').length },
    { id: 'event', label: '🎉 Events', count: notifications.filter(n => n.type === 'event').length },
    { id: 'trust', label: '📊 Trust', count: notifications.filter(n => n.type === 'trust').length },
    { id: 'badge', label: '🏆 Badges', count: notifications.filter(n => n.type === 'badge').length }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'review': return '🔴'
      case 'friend': return '🟡'
      case 'event': return '🔵'
      case 'trust': return '🟢'
      case 'community': return '🟣'
      case 'badge': return '🟢'
      default: return '🔵'
    }
  }

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const newReviews = notifications.filter(n => n.type === 'review' && !n.isRead).length
  const friendRequests = notifications.filter(n => n.type === 'friend' && !n.isRead).length
  const eventUpdates = notifications.filter(n => n.type === 'event' && !n.isRead).length
  const trustChanges = notifications.filter(n => n.type === 'trust' && !n.isRead).length
  const communityUpdates = notifications.filter(n => n.type === 'community' && !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const clearOld = () => {
    setNotifications(prev => prev.filter(n => !n.isRead))
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>🔙 Back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <CogIcon className="w-5 h-5" />
            <span>⚙️ Settings</span>
          </button>
        </div>

        {/* Notification Summary */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 NOTIFICATION SUMMARY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span>🔴 {newReviews} New Reviews</span>
              <span>•</span>
              <span>🟡 {friendRequests} Friend Requests</span>
              <span>•</span>
              <span>🔵 {eventUpdates} Event Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🟢 {trustChanges} Trust Score Change</span>
              <span>•</span>
              <span>🟣 {communityUpdates} Community Updates</span>
            </div>
          </div>
        </div>

        {/* Filter & Actions */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">🎯 FILTER & ACTIONS</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className="ml-1 text-xs opacity-75">({filter.count})</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-sm transition-colors duration-200"
              >
                ✅ Mark All Read
              </button>
              <button
                onClick={clearOld}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm transition-colors duration-200"
              >
                🗑️ Clear Old
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-sm transition-colors duration-200"
              >
                📧 Email Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📬 RECENT NOTIFICATIONS</h3>
          
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  notification.isRead 
                    ? 'bg-slate-50 border-slate-200' 
                    : 'bg-white border-primary-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {notification.title} • {notification.time}
                      </h4>
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 bg-primary-500 rounded-full ml-2"></span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  >
                    <EyeIcon className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-700">{notification.content}</p>
                  {notification.details && (
                    <p className="text-slate-600 text-sm">{notification.details}</p>
                  )}
                  {notification.subtext && (
                    <p className="text-slate-500 text-sm">{notification.subtext}</p>
                  )}
                </div>

                {notification.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        className="px-3 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg text-sm transition-colors duration-200"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📱 NOTIFICATION PREFERENCES</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">⚙️ Quick Settings:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  🔔 Push: ON
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  📧 Email: ON
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  📱 SMS: OFF
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  🌙 Quiet Hours: 10PM-7AM
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 mb-3">
                📊 This Week: 47 notifications • {unreadCount} unread • 5 actions needed
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => router.push('/settings')}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition-colors duration-200"
                >
                  ⚙️ Manage All Settings
                </button>
                <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition-colors duration-200">
                  📊 View Analytics
                </button>
                <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition-colors duration-200">
                  🔇 Snooze All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 