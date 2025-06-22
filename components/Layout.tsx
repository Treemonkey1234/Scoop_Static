'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  HomeIcon, 
  CalendarIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  UserIcon,
  PlusIcon,
  ChartBarIcon,
  SparklesIcon,
  Cog6ToothIcon,
  UsersIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid'
import { sampleUsers, getCurrentUser, User } from '@/lib/sampleData'

// Global Walkthrough Modal Component
const GlobalWalkthroughModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  // Restore step from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedStep = localStorage.getItem('currentWalkthroughStep')
      if (savedStep) {
        const stepNumber = parseInt(savedStep, 10)
        if (!isNaN(stepNumber) && stepNumber >= 0 && stepNumber < steps.length) {
          setCurrentStep(stepNumber)
        }
      }
    }
  }, [isOpen])

  const steps = [
    {
      title: "Welcome to ScoopSocials! 🍦",
      content: "Let's take a quick tour of your new trust-based social platform. This walkthrough will guide you through each section.",
      highlight: "header",
      page: "/"
    },
    {
      title: "Header Navigation 📊",
      content: "Your header contains the Analytics button (left) and Create button (right). Let's check out Analytics first!",
      highlight: "header",
      page: "/",
      action: "analytics"
    },
    {
      title: "Analytics Dashboard 📈",
      content: "Here you can track your trust score trends, engagement metrics, and community impact. This helps you understand your reputation growth.",
      highlight: "analytics",
      page: "/analytics"
    },
    {
      title: "Your Profile Hub 👤",
      content: "Your profile shows your trust score, connected accounts, and recent reviews. This is your digital reputation center.",
      highlight: "profile",
      page: "/profile"
    },
    {
      title: "Trust Score Breakdown 📊",
      content: "Click on your trust score to see the detailed breakdown. It's calculated from 11 factors including social verification and community engagement.",
      highlight: "trust",
      page: "/profile"
    },
    {
      title: "Connected Accounts 🌐",
      content: "Link your social media accounts to boost your trust score. More verified accounts = higher community trust. Let's see all your accounts!",
      highlight: "accounts",
      page: "/profile",
      action: "connected-accounts"
    },
    {
      title: "Account Management 🔗",
      content: "Here you can manage all your connected social media accounts. Each verified account adds to your trust score!",
      highlight: "accounts",
      page: "/connected-accounts"
    },
    {
      title: "Events & Networking 📅",
      content: "Browse and join events in your community. Attending events and leaving reviews builds your network and trust score.",
      highlight: "events",
      page: "/events"
    },
    {
      title: "Building Friendships 👥",
      content: "Connect with trusted community members. Friend connections help you discover events and build your local network.",
      highlight: "friends",
      page: "/friends"
    },
    {
      title: "Discovery Features 🔍",
      content: "Use search to find events, people, and content that match your interests and trust preferences.",
      highlight: "discovery",
      page: "/search"
    },
    {
      title: "Platform Settings ⚙️",
      content: "Manage your account settings, privacy preferences, and platform configurations here.",
      highlight: "settings",
      page: "/settings"
    },
    {
      title: "Understanding Posts 📝",
      content: "Back to the home feed! Posts are trust-based reviews with voting arrows on the left. Community validation shows agreement levels.",
      highlight: "posts",
      page: "/"
    },
    {
      title: "Creating Content ✏️",
      content: "Use the Create button to share reviews or host events. Quality content boosts your trust score and helps the community.",
      highlight: "create",
      page: "/"
    },
    {
      title: "You're All Set! 🎉",
      content: "You've completed the tour! Start building trust by creating content, attending events, and engaging with your community.",
      highlight: "complete",
      page: "/"
    }
  ]

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const nextStepData = steps[currentStep + 1]
      
      // Store walkthrough state before navigation
      localStorage.setItem('walkthroughInProgress', 'true')
      localStorage.setItem('currentWalkthroughStep', (currentStep + 1).toString())
      
      // Navigate to the next page if needed
      if (nextStepData.page && nextStepData.page !== window.location.pathname) {
        try {
          await router.push(nextStepData.page)
          // Wait for navigation to complete - increased timeout for reliability
          await new Promise(resolve => setTimeout(resolve, 1800))
        } catch (error) {
          console.error('Navigation error:', error)
        }
      }
      
      setCurrentStep(currentStep + 1)
      
      // Perform specific actions after navigation and step update
      setTimeout(() => {
        if (nextStepData.action === "analytics") {
          // Highlight analytics button
          const analyticsBtn = document.querySelector('[href="/analytics"]')
          if (analyticsBtn) {
            analyticsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        } else if (nextStepData.action === "connected-accounts") {
          // Highlight connected accounts button
          const accountsBtn = document.querySelector('[href="/connected-accounts"]')
          if (accountsBtn) {
            accountsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 2000)
    } else {
      // Clear walkthrough state when finished
      localStorage.removeItem('walkthroughInProgress')
      localStorage.removeItem('currentWalkthroughStep')
      onClose()
    }
  }

  const prevStep = async () => {
    if (currentStep > 0) {
      const prevStepData = steps[currentStep - 1]
      
      // Store walkthrough state before navigation
      localStorage.setItem('walkthroughInProgress', 'true')
      localStorage.setItem('currentWalkthroughStep', (currentStep - 1).toString())
      
      // Navigate to the previous page if needed
      if (prevStepData.page && prevStepData.page !== window.location.pathname) {
        try {
          await router.push(prevStepData.page)
          await new Promise(resolve => setTimeout(resolve, 1800))
        } catch (error) {
          console.error('Navigation error:', error)
        }
      }
      
      setCurrentStep(currentStep - 1)
    }
  }

  const skipWalkthrough = () => {
    // Clear walkthrough state when skipped
    localStorage.removeItem('walkthroughInProgress')
    localStorage.removeItem('currentWalkthroughStep')
    onClose()
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{currentStepData.title}</h2>
            <button
              onClick={skipWalkthrough}
              className="text-cyan-100 hover:text-white transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-cyan-600 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">{currentStep + 1}/{steps.length}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed mb-6">
            {currentStepData.content}
          </p>

          {/* Current Page Indicator */}
          <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="text-sm text-cyan-700">
              📍 <strong>Current Page:</strong> {currentStepData.page === '/' ? 'Home Feed' : currentStepData.page.slice(1).charAt(0).toUpperCase() + currentStepData.page.slice(2)}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex space-x-2">
              <button
                onClick={skipWalkthrough}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
              >
                Skip Tour
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all duration-200"
              >
                {currentStep === steps.length - 1 ? 'Finish Tour' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [globalWalkthrough, setGlobalWalkthrough] = useState(false)

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

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Check for ongoing walkthrough first
    const walkthroughInProgress = localStorage.getItem('walkthroughInProgress')
    const savedStep = localStorage.getItem('currentWalkthroughStep')
    
    if (walkthroughInProgress === 'true' && savedStep) {
      // Restore walkthrough state after page navigation
      setTimeout(() => {
        setGlobalWalkthrough(true)
        // The GlobalWalkthroughModal will handle restoring the correct step
      }, 500)
    } else {
      // Check for new user walkthrough
      const isNewUser = localStorage.getItem('isNewUser')
      if (isNewUser === 'true') {
        localStorage.removeItem('isNewUser')
        setTimeout(() => {
          setGlobalWalkthrough(true)
        }, 1000)
      }
    }

    // Listen for walkthrough triggers from other components
    const handleWalkthroughTrigger = () => {
      setGlobalWalkthrough(true)
    }

    window.addEventListener('triggerWalkthrough', handleWalkthroughTrigger)
    return () => window.removeEventListener('triggerWalkthrough', handleWalkthroughTrigger)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative">
      {/* Top Loading Bar */}
      <TopLoadingBar isLoading={isLoading} />

      {/* Enhanced Floating Ice Cream Background */}
      <div className="floating-ice-cream">
        {/* SVG Ice Cream Cones with Scoops */}
        <svg className="floating-ice-cream-1" width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
          {/* Cone */}
          <path d="M15 35 L20 55 L25 35 Z" fill="url(#coneGradient1)" stroke="#8B4513" strokeWidth="0.5"/>
          <pattern id="waffle" patternUnits="userSpaceOnUse" width="3" height="3">
            <rect width="3" height="3" fill="#D2691E"/>
            <path d="M0,3 L3,0 M1.5,3 L3,1.5 M0,1.5 L1.5,0" stroke="#8B4513" strokeWidth="0.3"/>
          </pattern>
          <path d="M15 35 L20 55 L25 35 Z" fill="url(#waffle)" opacity="0.6"/>
          {/* Scoops */}
          <circle cx="20" cy="32" r="6" fill="url(#strawberryGradient)"/>
          <circle cx="20" cy="24" r="5.5" fill="url(#vanillaGradient)"/>
          <circle cx="20" cy="17" r="5" fill="url(#chocolateGradient)"/>
          {/* Cherry on top */}
          <circle cx="20" cy="14" r="1.5" fill="#FF1744"/>
          <path d="M20 12 Q18 10 19 9" stroke="#4CAF50" strokeWidth="0.8" fill="none"/>
          {/* Gradients */}
          <defs>
            <linearGradient id="coneGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4A460"/>
              <stop offset="100%" stopColor="#D2691E"/>
            </linearGradient>
            <linearGradient id="strawberryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB3BA"/>
              <stop offset="100%" stopColor="#FF8A95"/>
            </linearGradient>
            <linearGradient id="vanillaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC"/>
              <stop offset="100%" stopColor="#F5DEB3"/>
            </linearGradient>
            <linearGradient id="chocolateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E"/>
              <stop offset="100%" stopColor="#8B4513"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-2" width="35" height="55" viewBox="0 0 35 55" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 32 L17.5 50 L23 32 Z" fill="url(#coneGradient2)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="17.5" cy="29" r="5.5" fill="url(#mintGradient)"/>
          <circle cx="17.5" cy="22" r="5" fill="url(#berryGradient)"/>
          <circle cx="17.5" cy="19" r="1.2" fill="#FF6B35"/>
          <defs>
            <linearGradient id="coneGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#CD853F"/>
            </linearGradient>
            <linearGradient id="mintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#98FB98"/>
              <stop offset="100%" stopColor="#90EE90"/>
            </linearGradient>
            <linearGradient id="berryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDA0DD"/>
              <stop offset="100%" stopColor="#BA55D3"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-3" width="38" height="58" viewBox="0 0 38 58" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 34 L19 52 L24 34 Z" fill="url(#coneGradient3)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="19" cy="31" r="6" fill="url(#orangeGradient)"/>
          <circle cx="19" cy="23" r="5.5" fill="url(#lemonGradient)"/>
          <circle cx="19" cy="20" r="1.3" fill="#FF4444"/>
          <path d="M19 18 Q17.5 16.5 18 15.5" stroke="#2E7D32" strokeWidth="0.7" fill="none"/>
          <defs>
            <linearGradient id="coneGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DEB3"/>
              <stop offset="100%" stopColor="#DEB887"/>
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE4B5"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </linearGradient>
            <linearGradient id="lemonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFACD"/>
              <stop offset="100%" stopColor="#F0E68C"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-4" width="36" height="56" viewBox="0 0 36 56" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 33 L18 51 L23 33 Z" fill="url(#coneGradient4)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="18" cy="30" r="5.8" fill="url(#bubblegumGradient)"/>
          <circle cx="18" cy="22.5" r="5.2" fill="url(#cookiesGradient)"/>
          <circle cx="18" cy="19.5" r="1.1" fill="#E91E63"/>
          <defs>
            <linearGradient id="coneGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6C7"/>
              <stop offset="100%" stopColor="#B8860B"/>
            </linearGradient>
            <linearGradient id="bubblegumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
            <linearGradient id="cookiesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E6D3"/>
              <stop offset="100%" stopColor="#D2B48C"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Individual floating scoops for variety */}
        <svg className="floating-scoop-solo-1" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" fill="url(#soloStrawberry)"/>
          <defs>
            <radialGradient id="soloStrawberry">
              <stop offset="0%" stopColor="#FFB3C6"/>
              <stop offset="100%" stopColor="#FB8C96"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-2" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7" fill="url(#soloMint)"/>
          <defs>
            <radialGradient id="soloMint">
              <stop offset="0%" stopColor="#B8F2B8"/>
              <stop offset="100%" stopColor="#98FB98"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-3" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="9" fill="url(#soloChocolate)"/>
          <defs>
            <radialGradient id="soloChocolate">
              <stop offset="0%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#8B4513"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-cyan-200/50 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/scoop-logo.png" 
                  alt="ScoopSocials Logo" 
                  className="w-10 h-10 rounded-2xl shadow-lg object-cover"
                />
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

      {/* Global Walkthrough Modal */}
      <GlobalWalkthroughModal isOpen={globalWalkthrough} onClose={() => setGlobalWalkthrough(false)} />
    </div>
  )
}

export default Layout 