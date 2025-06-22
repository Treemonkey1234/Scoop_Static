'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  CalendarIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  UserIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  BellIcon as BellIconSolid
} from '@heroicons/react/24/solid'
import { sampleUsers } from '@/lib/sampleData'

interface LayoutProps {
  children: React.ReactNode
}

// Sprinkle celebration component
const SprinkleCelebration: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="sprinkle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            background: ['#FF69B4', '#32CD32', '#FFD700', '#FF4500', '#9370DB', '#00CED1'][Math.floor(Math.random() * 6)]
          }}
        />
      ))}
    </div>
  )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationCount, setNotificationCount] = useState(3)
  const [isOnline, setIsOnline] = useState(true)
  const [showToast, setShowToast] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update notification count
      if (Math.random() > 0.8) {
        setNotificationCount(prev => prev + 1)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

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
      badge: 2
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
      badge: 1
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      iconSolid: UserIconSolid,
      badge: null
    },
  ]

  const createMenuItems = [
    { name: 'Create Review', href: '/create-post', icon: '✏️', description: 'Share your experience' },
    { name: 'Create Event', href: '/create-event', icon: '📅', description: 'Host a gathering' },
    { name: 'Invite Friends', href: '/invite', icon: '👥', description: 'Grow your network' },
  ]

  const quickActions = [
    { name: 'Messages', icon: ChatBubbleLeftIcon, count: 2 },
    { name: 'Notifications', icon: BellIcon, count: notificationCount },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative">
      {/* Floating Ice Cream Background */}
      <div className="floating-scoops">
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-scoop"></div>
        <div className="floating-cone" style={{ left: '15%', animationDelay: '1s' }}></div>
        <div className="floating-cone" style={{ left: '35%', animationDelay: '5s' }}></div>
        <div className="floating-cone" style={{ left: '55%', animationDelay: '9s' }}></div>
        <div className="floating-cone" style={{ left: '75%', animationDelay: '13s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-primary-100/50 shadow-soft">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className={`status-${isOnline ? 'online' : 'offline'} absolute -bottom-1 -right-1`}></div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text-premium">ScoopSocials</h1>
                <p className="text-xs text-slate-500 -mt-1">Trust-Based Social</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 group"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>

              {/* Quick Actions */}
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 group"
                >
                  <action.icon className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                  {action.count > 0 && (
                    <span className="notification-badge">{action.count}</span>
                  )}
                </button>
              ))}

              {/* Create Button */}
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="relative p-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, events, reviews..."
                  className="input-field-premium w-full pl-10 pr-4"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </header>

      {/* Create Menu Dropdown */}
      {showCreateMenu && (
        <div className="fixed top-16 right-4 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 min-w-[200px]">
          {createMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setShowCreateMenu(false)}
              className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors duration-200"
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <div>
                <div className="font-medium text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-500">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content with Enhanced Spacing */}
      <main className="pb-24 min-h-screen">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-primary-200/50 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center py-2 px-4">
            {navigationItems.map((item) => {
              const Icon = isActive(item.href) ? item.iconSolid : item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {item.badge && (
                      <span className="notification-badge">{item.badge}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Click outside to close menus */}
      {(showCreateMenu || showSearch) && (
        <div 
          className="fixed inset-0 z-45" 
          onClick={() => {
            setShowCreateMenu(false)
            setShowSearch(false)
          }}
        />
      )}

      {/* Floating Action Button for Mobile (Optional) */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 active:scale-95 md:hidden">
        <SparklesIcon className="w-6 h-6 text-white" />
      </button>

      {/* Sprinkle Celebration */}
      <SprinkleCelebration show={showToast} />
    </div>
  )
}

export default Layout 