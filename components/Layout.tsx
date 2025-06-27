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
import UserProfile from '@/components/UserProfile'

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white p-6 text-center relative">
          <div className="text-3xl mb-2">🍦</div>
          <h2 className="text-xl font-bold mb-1">{currentStepData.title}</h2>
          <div className="text-cyan-100 text-sm">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={skipWalkthrough}
              className="text-cyan-100 hover:text-white text-sm underline"
            >
              Skip Tour
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 leading-relaxed mb-6">
            {currentStepData.content}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200 font-medium"
              >
                Previous
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-sm"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LayoutProps {
  children: React.ReactNode
}

// Enhanced Loading Bar Component
const TopLoadingBar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <div className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 z-50 transition-all duration-300 ${
      isLoading ? 'opacity-100 animate-pulse' : 'opacity-0'
    }`}>
      <div className="h-full bg-gradient-to-r from-cyan-600 to-teal-600 animate-pulse" />
    </div>
  )
}

// Sprinkle Celebration Component
const SprinkleCelebration: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        >
          {['🌟', '✨', '🎉', '🍦', '🎊'][Math.floor(Math.random() * 5)]}
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
  const [authUser, setAuthUser] = useState<any>(null) // Auth0 user
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

  // Fetch user session data
  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        // Only set authUser if we actually have session data
        if (data.session && data.session.sub) {
          setAuthUser(data.session)
        } else {
          setAuthUser(null)
        }
      } else {
        setAuthUser(null)
      }
    } catch (error) {
      console.error('Error fetching user session:', error)
      setAuthUser(null)
    }
  }

  useEffect(() => {
    // Fetch Auth0 user session
    fetchUserSession()
    
    // Get current platform user (for backwards compatibility)
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
        {/* Original SVG Ice Cream Cones with Scoops */}
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

        {/* NEW: Additional ice cream cones for tripled amount */}
        <svg className="floating-ice-cream-5" width="42" height="62" viewBox="0 0 42 62" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 36 L21 56 L26 36 Z" fill="url(#coneGradient5)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="21" cy="33" r="6.2" fill="url(#pistachioGradient)"/>
          <circle cx="21" cy="25" r="5.7" fill="url(#coconutGradient)"/>
          <circle cx="21" cy="18" r="5.2" fill="url(#caramelGradient)"/>
          <circle cx="21" cy="15" r="1.4" fill="#FF6347"/>
          <path d="M21 13 Q19 11 20 10" stroke="#228B22" strokeWidth="0.8" fill="none"/>
          <defs>
            <linearGradient id="coneGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CD853F"/>
              <stop offset="100%" stopColor="#A0522D"/>
            </linearGradient>
            <linearGradient id="pistachioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C7E9B4"/>
              <stop offset="100%" stopColor="#93D3AE"/>
            </linearGradient>
            <linearGradient id="coconutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEF7"/>
              <stop offset="100%" stopColor="#F5F5DC"/>
            </linearGradient>
            <linearGradient id="caramelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDBF94"/>
              <stop offset="100%" stopColor="#C19A6B"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-6" width="33" height="53" viewBox="0 0 33 53" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 30 L16.5 48 L22 30 Z" fill="url(#coneGradient6)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="16.5" cy="27" r="5.3" fill="url(#rockyRoadGradient)"/>
          <circle cx="16.5" cy="20" r="4.8" fill="url(#neapolitanGradient)"/>
          <circle cx="16.5" cy="17" r="1" fill="#DC143C"/>
          <defs>
            <linearGradient id="coneGradient6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5B887"/>
              <stop offset="100%" stopColor="#D2B48C"/>
            </linearGradient>
            <linearGradient id="rockyRoadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B7355"/>
              <stop offset="50%" stopColor="#A0522D"/>
              <stop offset="100%" stopColor="#654321"/>
            </linearGradient>
            <linearGradient id="neapolitanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="33%" stopColor="#FFF8DC"/>
              <stop offset="66%" stopColor="#8B4513"/>
              <stop offset="100%" stopColor="#FFB6C1"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-7" width="39" height="59" viewBox="0 0 39 59" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 35 L19.5 53 L24 35 Z" fill="url(#coneGradient7)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="19.5" cy="32" r="5.9" fill="url(#cottonCandyGradient)"/>
          <circle cx="19.5" cy="24" r="5.4" fill="url(#blueMoonGradient)"/>
          <circle cx="19.5" cy="21" r="1.3" fill="#FF1493"/>
          <path d="M19.5 19 Q18 17 19 16" stroke="#32CD32" strokeWidth="0.7" fill="none"/>
          <defs>
            <linearGradient id="coneGradient7" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4A460"/>
              <stop offset="100%" stopColor="#DAA520"/>
            </linearGradient>
            <linearGradient id="cottonCandyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="50%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#DDA0DD"/>
            </linearGradient>
            <linearGradient id="blueMoonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B0E0E6"/>
              <stop offset="100%" stopColor="#4169E1"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-8" width="37" height="57" viewBox="0 0 37 57" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 34 L18.5 52 L23 34 Z" fill="url(#coneGradient8)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="18.5" cy="31" r="5.6" fill="url(#rainbowGradient)"/>
          <circle cx="18.5" cy="23.5" r="5.1" fill="url(#tiramisu)"/>
          <circle cx="18.5" cy="20.5" r="1.2" fill="#FF4500"/>
          <defs>
            <linearGradient id="coneGradient8" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#BC9A6A"/>
            </linearGradient>
            <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF69B4"/>
              <stop offset="25%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#32CD32"/>
              <stop offset="75%" stopColor="#1E90FF"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </linearGradient>
            <linearGradient id="tiramisu" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E6D3"/>
              <stop offset="100%" stopColor="#D2B48C"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-9" width="41" height="61" viewBox="0 0 41 61" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 36 L20.5 56 L25.5 36 Z" fill="url(#coneGradient9)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="20.5" cy="33" r="6.1" fill="url(#cookieDoughGradient)"/>
          <circle cx="20.5" cy="25" r="5.6" fill="url(#matchaGradient)"/>
          <circle cx="20.5" cy="18.5" r="5.1" fill="url(#lavenderGradient)"/>
          <circle cx="20.5" cy="15.5" r="1.3" fill="#FF6B6B"/>
          <defs>
            <linearGradient id="coneGradient9" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DEB3"/>
              <stop offset="100%" stopColor="#CD853F"/>
            </linearGradient>
            <linearGradient id="cookieDoughGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E6B8"/>
              <stop offset="100%" stopColor="#D2B48C"/>
            </linearGradient>
            <linearGradient id="matchaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5D8A4"/>
              <stop offset="100%" stopColor="#9ACD32"/>
            </linearGradient>
            <linearGradient id="lavenderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#DDA0DD"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-10" width="34" height="54" viewBox="0 0 34 54" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 31 L17 49 L22 31 Z" fill="url(#coneGradient10)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="17" cy="28" r="5.4" fill="url(#blackberryGradient)"/>
          <circle cx="17" cy="21" r="4.9" fill="url(#honeycombGradient)"/>
          <circle cx="17" cy="18" r="1.1" fill="#B22222"/>
          <defs>
            <linearGradient id="coneGradient10" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6C7"/>
              <stop offset="100%" stopColor="#B8860B"/>
            </linearGradient>
            <linearGradient id="blackberryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B008B"/>
              <stop offset="100%" stopColor="#4B0082"/>
            </linearGradient>
            <linearGradient id="honeycombGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Original Individual floating scoops */}
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

        {/* NEW: Additional floating scoops for tripled amount */}
        <svg className="floating-scoop-solo-4" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="url(#soloBlueberry)"/>
          <defs>
            <radialGradient id="soloBlueberry">
              <stop offset="0%" stopColor="#B3C6F2"/>
              <stop offset="100%" stopColor="#4169E1"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-5" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9.5" cy="9.5" r="7.5" fill="url(#soloMango)"/>
          <defs>
            <radialGradient id="soloMango">
              <stop offset="0%" stopColor="#FFE4B5"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-6" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10.5" cy="10.5" r="8.5" fill="url(#soloRaspberry)"/>
          <defs>
            <radialGradient id="soloRaspberry">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#DC143C"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-7" width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.5" cy="8.5" r="6.5" fill="url(#soloLime)"/>
          <defs>
            <radialGradient id="soloLime">
              <stop offset="0%" stopColor="#CCFF99"/>
              <stop offset="100%" stopColor="#32CD32"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-8" width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11.5" cy="11.5" r="9.5" fill="url(#soloLavender)"/>
          <defs>
            <radialGradient id="soloLavender">
              <stop offset="0%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-9" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" fill="url(#soloCaramel)"/>
          <defs>
            <radialGradient id="soloCaramel">
              <stop offset="0%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#CD853F"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-10" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7" fill="url(#soloRose)"/>
          <defs>
            <radialGradient id="soloRose">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-11" width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10.5" fill="url(#soloButterscotch)"/>
          <defs>
            <radialGradient id="soloButterscotch">
              <stop offset="0%" stopColor="#F0E68C"/>
              <stop offset="100%" stopColor="#DAA520"/>
            </radialGradient>
          </defs>
        </svg>

        {/* DOUBLED EXPANSION: Additional 21 Premium Ice Cream Elements */}
        
        {/* Premium Multi-Scoop Cones (11-21) with Unique Designs */}
        <svg className="floating-ice-cream-11" width="44" height="64" viewBox="0 0 44 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 37 L22 57 L27 37 Z" fill="url(#galaxyCone)" stroke="#4B0082" strokeWidth="0.5"/>
          <circle cx="22" cy="34" r="6.5" fill="url(#galaxyScoop1)"/>
          <circle cx="22" cy="26" r="6" fill="url(#galaxyScoop2)"/>
          <circle cx="22" cy="19" r="5.5" fill="url(#galaxyScoop3)"/>
          <circle cx="22" cy="16" r="1.5" fill="#FF1493"/>
          <path d="M22 14 Q20 12 21 11" stroke="#00CED1" strokeWidth="0.9" fill="none"/>
          <defs>
            <linearGradient id="galaxyCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B0082"/>
              <stop offset="100%" stopColor="#191970"/>
            </linearGradient>
            <linearGradient id="galaxyScoop1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1493"/>
              <stop offset="33%" stopColor="#9370DB"/>
              <stop offset="66%" stopColor="#4169E1"/>
              <stop offset="100%" stopColor="#00CED1"/>
            </linearGradient>
            <linearGradient id="galaxyScoop2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#FF4500"/>
              <stop offset="100%" stopColor="#DC143C"/>
            </linearGradient>
            <linearGradient id="galaxyScoop3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FA9A"/>
              <stop offset="100%" stopColor="#228B22"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-12" width="38" height="58" viewBox="0 0 38 58" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 35 L19 53 L24 35 Z" fill="url(#tropicalCone)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="19" cy="32" r="6.2" fill="url(#coconutTropical)"/>
          <circle cx="19" cy="24" r="5.7" fill="url(#mangoTropical)"/>
          <circle cx="19" cy="21" r="1.4" fill="#FF6347"/>
          <path d="M19 19 Q17.5 17 18.5 16" stroke="#32CD32" strokeWidth="0.8" fill="none"/>
          <defs>
            <linearGradient id="tropicalCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#CD853F"/>
            </linearGradient>
            <linearGradient id="coconutTropical" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEF7"/>
              <stop offset="100%" stopColor="#F0F8FF"/>
            </linearGradient>
            <linearGradient id="mangoTropical" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE135"/>
              <stop offset="100%" stopColor="#FFA500"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-13" width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 36 L20 54 L25 36 Z" fill="url(#espressoCone)" stroke="#654321" strokeWidth="0.5"/>
          <circle cx="20" cy="33" r="6" fill="url(#espressoScoop)"/>
          <circle cx="20" cy="25" r="5.5" fill="url(#mascarScoop)"/>
          <circle cx="20" cy="22" r="1.3" fill="#8B0000"/>
          <defs>
            <linearGradient id="espressoCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#654321"/>
              <stop offset="100%" stopColor="#3E2723"/>
            </linearGradient>
            <linearGradient id="espressoScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6F4E37"/>
              <stop offset="100%" stopColor="#3C1810"/>
            </linearGradient>
            <linearGradient id="mascarScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DEB3"/>
              <stop offset="100%" stopColor="#DEB887"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-14" width="36" height="56" viewBox="0 0 36 56" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 34 L18 52 L23 34 Z" fill="url(#unicornCone)" stroke="#FF69B4" strokeWidth="0.5"/>
          <circle cx="18" cy="31" r="5.8" fill="url(#unicornScoop1)"/>
          <circle cx="18" cy="23.5" r="5.3" fill="url(#unicornScoop2)"/>
          <circle cx="18" cy="20.5" r="1.2" fill="#FF1493"/>
          <defs>
            <linearGradient id="unicornCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF69B4"/>
              <stop offset="50%" stopColor="#DDA0DD"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </linearGradient>
            <linearGradient id="unicornScoop1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="25%" stopColor="#FF69B4"/>
              <stop offset="50%" stopColor="#9370DB"/>
              <stop offset="75%" stopColor="#4169E1"/>
              <stop offset="100%" stopColor="#00CED1"/>
            </linearGradient>
            <linearGradient id="unicornScoop2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#FF4500"/>
              <stop offset="100%" stopColor="#FF1493"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-15" width="43" height="63" viewBox="0 0 43 63" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 37 L21.5 57 L26.5 37 Z" fill="url(#autumnCone)" stroke="#8B4513" strokeWidth="0.5"/>
          <circle cx="21.5" cy="34" r="6.3" fill="url(#pumpkinScoop)"/>
          <circle cx="21.5" cy="26" r="5.8" fill="url(#cinnamonScoop)"/>
          <circle cx="21.5" cy="18.5" r="5.3" fill="url(#appleScoop)"/>
          <circle cx="21.5" cy="15.5" r="1.4" fill="#DC143C"/>
          <path d="M21.5 13.5 Q20 12 21 11" stroke="#228B22" strokeWidth="0.8" fill="none"/>
          <defs>
            <linearGradient id="autumnCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E"/>
              <stop offset="100%" stopColor="#8B4513"/>
            </linearGradient>
            <linearGradient id="pumpkinScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7F50"/>
              <stop offset="100%" stopColor="#FF4500"/>
            </linearGradient>
            <linearGradient id="cinnamonScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E"/>
              <stop offset="100%" stopColor="#A0522D"/>
            </linearGradient>
            <linearGradient id="appleScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ACD32"/>
              <stop offset="100%" stopColor="#228B22"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-16" width="35" height="55" viewBox="0 0 35 55" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 33 L17.5 51 L22.5 33 Z" fill="url(#oceaCone)" stroke="#4682B4" strokeWidth="0.5"/>
          <circle cx="17.5" cy="30" r="5.9" fill="url(#seaSaltScoop)"/>
          <circle cx="17.5" cy="22" r="5.4" fill="url(#seaweedScoop)"/>
          <circle cx="17.5" cy="19" r="1.1" fill="#00CED1"/>
          <defs>
            <linearGradient id="oceaCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4682B4"/>
              <stop offset="100%" stopColor="#191970"/>
            </linearGradient>
            <linearGradient id="seaSaltScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F8FF"/>
              <stop offset="100%" stopColor="#B0E0E6"/>
            </linearGradient>
            <linearGradient id="seaweedScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#90EE90"/>
              <stop offset="100%" stopColor="#006400"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-17" width="41" height="61" viewBox="0 0 41 61" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 36 L20.5 56 L25.5 36 Z" fill="url(#sunsetCone)" stroke="#FF4500" strokeWidth="0.5"/>
          <circle cx="20.5" cy="33" r="6.1" fill="url(#sunsetScoop1)"/>
          <circle cx="20.5" cy="25" r="5.6" fill="url(#sunsetScoop2)"/>
          <circle cx="20.5" cy="22" r="1.3" fill="#FF6347"/>
          <path d="M20.5 20 Q19 18 20 17" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
          <defs>
            <linearGradient id="sunsetCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4500"/>
              <stop offset="100%" stopColor="#DC143C"/>
            </linearGradient>
            <linearGradient id="sunsetScoop1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#FF4500"/>
              <stop offset="100%" stopColor="#DC143C"/>
            </linearGradient>
            <linearGradient id="sunsetScoop2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF69B4"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-18" width="32" height="52" viewBox="0 0 32 52" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 31 L16 49 L21 31 Z" fill="url(#midnightCone)" stroke="#000000" strokeWidth="0.5"/>
          <circle cx="16" cy="28" r="5.5" fill="url(#midnightScoop)"/>
          <circle cx="16" cy="21" r="5" fill="url(#stardustScoop)"/>
          <circle cx="16" cy="18" r="1" fill="#FFD700"/>
          <defs>
            <linearGradient id="midnightCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F2F2F"/>
              <stop offset="100%" stopColor="#000000"/>
            </linearGradient>
            <linearGradient id="midnightScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#191970"/>
              <stop offset="100%" stopColor="#000080"/>
            </linearGradient>
            <linearGradient id="stardustScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C0C0C0"/>
              <stop offset="100%" stopColor="#708090"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-19" width="39" height="59" viewBox="0 0 39 59" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 35 L19.5 53 L24.5 35 Z" fill="url(#springCone)" stroke="#32CD32" strokeWidth="0.5"/>
          <circle cx="19.5" cy="32" r="5.9" fill="url(#sakuraScoop)"/>
          <circle cx="19.5" cy="24" r="5.4" fill="url(#matschaScoop)"/>
          <circle cx="19.5" cy="21" r="1.3" fill="#FF1493"/>
          <path d="M19.5 19 Q18 17 19 16" stroke="#90EE90" strokeWidth="0.7" fill="none"/>
          <defs>
            <linearGradient id="springCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ACD32"/>
              <stop offset="100%" stopColor="#32CD32"/>
            </linearGradient>
            <linearGradient id="sakuraScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
            <linearGradient id="matschaScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C7E9B4"/>
              <stop offset="100%" stopColor="#90EE90"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-20" width="37" height="57" viewBox="0 0 37 57" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 34 L18.5 52 L23.5 34 Z" fill="url(#royalCone)" stroke="#4B0082" strokeWidth="0.5"/>
          <circle cx="18.5" cy="31" r="5.8" fill="url(#lavenderRoyale)"/>
          <circle cx="18.5" cy="23.5" r="5.3" fill="url(#goldRoyale)"/>
          <circle cx="18.5" cy="20.5" r="1.2" fill="#8B0000"/>
          <defs>
            <linearGradient id="royalCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B0082"/>
              <stop offset="100%" stopColor="#8B008B"/>
            </linearGradient>
            <linearGradient id="lavenderRoyale" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </linearGradient>
            <linearGradient id="goldRoyale" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#DAA520"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="floating-ice-cream-21" width="45" height="65" viewBox="0 0 45 65" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 38 L22.5 58 L27.5 38 Z" fill="url(#candylandCone)" stroke="#FF1493" strokeWidth="0.5"/>
          <circle cx="22.5" cy="35" r="6.7" fill="url(#gummyScoop)"/>
          <circle cx="22.5" cy="27" r="6.2" fill="url(#lollipopScoop)"/>
          <circle cx="22.5" cy="19" r="5.7" fill="url(#candyFlossScoop)"/>
          <circle cx="22.5" cy="16" r="1.5" fill="#FF6347"/>
          <path d="M22.5 14 Q21 12 22 11" stroke="#FF1493" strokeWidth="0.9" fill="none"/>
          <defs>
            <linearGradient id="candylandCone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1493"/>
              <stop offset="50%" stopColor="#FF69B4"/>
              <stop offset="100%" stopColor="#DDA0DD"/>
            </linearGradient>
            <linearGradient id="gummyScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF69B4"/>
              <stop offset="25%" stopColor="#32CD32"/>
              <stop offset="50%" stopColor="#FFD700"/>
              <stop offset="75%" stopColor="#FF4500"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </linearGradient>
            <linearGradient id="lollipopScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1493"/>
              <stop offset="50%" stopColor="#00CED1"/>
              <stop offset="100%" stopColor="#32CD32"/>
            </linearGradient>
            <linearGradient id="candyFlossScoop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Artisanal Solo Scoops (12-21) with Gourmet Flavors */}
        <svg className="floating-scoop-solo-12" width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
          <circle cx="13" cy="13" r="11" fill="url(#soloTiramisu)"/>
          <defs>
            <radialGradient id="soloTiramisu">
              <stop offset="0%" stopColor="#F5DEB3"/>
              <stop offset="50%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#8B7355"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-13" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9.5" cy="9.5" r="7.5" fill="url(#soloLycChee)"/>
          <defs>
            <radialGradient id="soloLycChee">
              <stop offset="0%" stopColor="#FFFACD"/>
              <stop offset="100%" stopColor="#F0E68C"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-14" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="9" fill="url(#soloPassion)"/>
          <defs>
            <radialGradient id="soloPassion">
              <stop offset="0%" stopColor="#FFE4B5"/>
              <stop offset="100%" stopColor="#FF8C00"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-15" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="url(#soloTaro)"/>
          <defs>
            <radialGradient id="soloTaro">
              <stop offset="0%" stopColor="#DDA0DD"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-16" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7" fill="url(#soloSesame)"/>
          <defs>
            <radialGradient id="soloSesame">
              <stop offset="0%" stopColor="#F5F5DC"/>
              <stop offset="100%" stopColor="#D2B48C"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-17" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10.5" cy="10.5" r="8.5" fill="url(#soloUbe)"/>
          <defs>
            <radialGradient id="soloUbe">
              <stop offset="0%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#8A2BE2"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-18" width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11.5" cy="11.5" r="9.5" fill="url(#soloDurian)"/>
          <defs>
            <radialGradient id="soloDurian">
              <stop offset="0%" stopColor="#FFFACD"/>
              <stop offset="100%" stopColor="#BDB76B"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-19" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" fill="url(#soloRambler)"/>
          <defs>
            <radialGradient id="soloRambler">
              <stop offset="0%" stopColor="#DC143C"/>
              <stop offset="100%" stopColor="#8B0000"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-20" width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10.5" fill="url(#soloGalaxy)"/>
          <defs>
            <radialGradient id="soloGalaxy">
              <stop offset="0%" stopColor="#191970"/>
              <stop offset="50%" stopColor="#4B0082"/>
              <stop offset="100%" stopColor="#000000"/>
            </radialGradient>
          </defs>
        </svg>

        <svg className="floating-scoop-solo-21" width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.5" cy="8.5" r="6.5" fill="url(#soloKiwi)"/>
          <defs>
            <radialGradient id="soloKiwi">
              <stop offset="0%" stopColor="#ADFF2F"/>
              <stop offset="100%" stopColor="#9ACD32"/>
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
            
            {/* Action Buttons and User Profile */}
            <div className="flex items-center space-x-2">
              {/* Analytics Button - show when user is logged in (Auth0 or sample user) */}
              {(authUser || currentUser) && (
                <Link
                  href="/analytics"
                  onClick={handleNavigation}
                  className="relative p-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 transition-all duration-200 group"
                >
                  <ChartBarIcon className="w-5 h-5 text-cyan-600 group-hover:text-cyan-800" />
                </Link>
              )}

              {/* Create Button - show when user is logged in (Auth0 or sample user) */}
              {(authUser || currentUser) && (
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="relative p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white transition-all duration-200 shadow-sm"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              )}
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



      {/* Sprinkle Celebration */}
      <SprinkleCelebration show={showToast} />

      {/* Global Walkthrough Modal */}
      <GlobalWalkthroughModal isOpen={globalWalkthrough} onClose={() => setGlobalWalkthrough(false)} />
    </div>
  )
}

export default Layout 