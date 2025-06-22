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
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid'
import { sampleUsers } from '@/lib/sampleData'

interface LayoutProps {
  children: React.ReactNode
}

// Top Loading Bar Component
const TopLoadingBar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 100)

      return () => clearInterval(interval)
    } else {
      setProgress(100)
      setTimeout(() => setProgress(0), 500)
    }
  }, [isLoading])

  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-cyan-200/30">
      <div 
        className="h-full bg-gradient-to-r from-cyan-500 to-teal-600 transition-all duration-200 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Sprinkle celebration component
const SprinkleCelebration: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: '1s'
          }}
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
      ))}
    </div>
  )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate loading for navigation
  const handleNavigation = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }

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

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative">
      {/* Top Loading Bar */}
      <TopLoadingBar isLoading={isLoading} />

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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-cyan-200/50 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className={`status-${isOnline ? 'online' : 'offline'} absolute -bottom-1 -right-1`}></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">ScoopSocials</h1>
                <p className="text-xs text-slate-500 -mt-1">Trust-Based Social</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Analytics Button */}
              <Link
                href="/analytics"
                onClick={handleNavigation}
                className="relative p-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 transition-all duration-200 group"
              >
                <ChartBarIcon className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800" />
              </Link>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="relative p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white transition-all duration-200 shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Create Menu Dropdown */}
      {showCreateMenu && (
        <div className="fixed top-16 right-4 z-50 bg-white rounded-2xl shadow-xl border border-cyan-200 py-2 min-w-[200px]">
          {createMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                setShowCreateMenu(false)
                handleNavigation()
              }}
              className="flex items-center px-4 py-3 hover:bg-cyan-50 transition-colors duration-200"
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
      <main className="pb-24 min-h-screen pt-1">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-cyan-200/50 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center py-2 px-4">
            {navigationItems.map((item) => {
              const Icon = isActive(item.href) ? item.iconSolid : item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavigation}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {item.badge && (
                      <span className="notification-badge bg-cyan-500 border-cyan-100">{item.badge}</span>
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
      {showCreateMenu && (
        <div 
          className="fixed inset-0 z-45" 
          onClick={() => setShowCreateMenu(false)}
        />
      )}

      {/* Floating Action Button for Mobile (Optional) */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 active:scale-95 md:hidden">
        <SparklesIcon className="w-6 h-6 text-white" />
      </button>

      {/* Sprinkle Celebration */}
      <SprinkleCelebration show={showToast} />
    </div>
  )
}

export default Layout 