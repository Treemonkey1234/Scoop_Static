'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CalendarIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid'

// Remove sample data import and use minimal typing
interface User {
  id: number
  name: string
  avatar?: string
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Navigation badges - using real data
  const [friendRequests, setFriendRequests] = useState(0)
  const [eventNotifications, setEventNotifications] = useState(0)

  // Fetch real notification counts
  useEffect(() => {
    const fetchNotificationCounts = async () => {
      if (currentUser?.id && typeof currentUser.id === 'number') {
        try {
          const { friendsAPI } = await import('../lib/api')
          const requests = await friendsAPI.getFriendRequests(currentUser.id)
          setFriendRequests(requests.length)
        } catch (error) {
          console.error('Error fetching friend requests:', error)
          setFriendRequests(0)
        }
      } else {
        setFriendRequests(0)
        setEventNotifications(0)
      }
    }

    fetchNotificationCounts()
  }, [currentUser?.id])

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      badge: null
    },
    {
      name: 'Events',
      href: '/events',
      icon: CalendarIcon,
      iconSolid: CalendarIconSolid,
      badge: eventNotifications > 0 ? eventNotifications : null
    },
    {
      name: 'Search',
      href: '/search',
      icon: MagnifyingGlassIcon,
      iconSolid: MagnifyingGlassIconSolid,
      badge: null
    },
    {
      name: 'Friends',
      href: '/friends',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
      badge: friendRequests > 0 ? friendRequests : null
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      iconSolid: UserIconSolid,
      badge: null
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Scoop</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link 
              href="/notifications" 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BellIcon className="w-6 h-6" />
              {(friendRequests + eventNotifications) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {friendRequests + eventNotifications}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            <Link href="/profile" className="flex items-center space-x-2">
              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </Link>

            {/* Settings */}
            <Link 
              href="/settings" 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-0 relative"
              >
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 ${
                      isActive 
                        ? 'text-cyan-600' 
                        : 'text-gray-600'
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 ${
                    isActive 
                      ? 'text-cyan-600 font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 