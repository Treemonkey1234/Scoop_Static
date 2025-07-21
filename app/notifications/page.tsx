'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  BellIcon,
  ChevronLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function NotificationsPage() {
  const router = useRouter()
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [notifications, setNotifications] = useState<any[]>([])

  const filters = [
    { id: 'all', label: '📋 All', count: 0 },
    { id: 'review', label: '⭐ Reviews', count: 0 },
    { id: 'friend', label: '👥 Friends', count: 0 },
    { id: 'event', label: '🎉 Events', count: 0 },
    { id: 'trust', label: '📊 Trust', count: 0 },
    { id: 'badge', label: '🏆 Badges', count: 0 }
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

  const filteredNotifications = notifications.filter(n => 
    activeFilter === 'all' || n.type === activeFilter
  )

  const unreadCount = 0
  const newReviews = 0
  const friendRequests = 0
  const eventUpdates = 0
  const trustChanges = 0
  const communityUpdates = 0

  const markAllAsRead = () => {
    // Function for future use
  }

  const clearOld = () => {
    // Function for future use
  }

  const markAsRead = (id: string) => {
    // Function for future use
  }

  return (
    <Layout>
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
            <p className="text-sm text-slate-500">Stay updated with your network</p>
          </div>
          <BellIcon className="w-6 h-6 text-slate-400" />
        </div>

        {/* Summary */}
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
              <span>🟢 {trustChanges} Trust Score Changes</span>
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
                disabled
              >
                ✅ Mark All Read
              </button>
              <button
                onClick={clearOld}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm transition-colors duration-200"
                disabled
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
          
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No notifications yet</h3>
              <p className="text-slate-500 mb-6">
                When you connect with friends, attend events, or receive reviews, you'll see notifications here.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => router.push('/friends')}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  👥 Find Friends
                </button>
                <button
                  onClick={() => router.push('/events')}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  📅 Browse Events
                </button>
              </div>
            </div>
          ) : (
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
                  
                  <div className="ml-8">
                    <p className="text-slate-700 mb-2">{notification.content}</p>
                    <p className="text-sm text-slate-600 mb-2">{notification.details}</p>
                    {notification.subtext && (
                      <p className="text-xs text-slate-500">{notification.subtext}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-soft">
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-3">
              📊 This Week: {notifications.length} notifications • {unreadCount} unread • 0 actions needed
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
    </Layout>
  )
} 