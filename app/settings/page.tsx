'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { getCurrentUser, User } from '@/lib/sampleData'
import { 
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  MapPinIcon,
  SunIcon,
  UserIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  ChevronRightIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

// Walkthrough Modal Component
const WalkthroughModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

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
      
      // Navigate to the next page if needed
      if (nextStepData.page && nextStepData.page !== window.location.pathname) {
        try {
          await router.push(nextStepData.page)
          // Wait for navigation to complete
          await new Promise(resolve => setTimeout(resolve, 1000))
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
      }, 1500)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipWalkthrough = () => {
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
              <span className="font-medium">Current page:</span> {currentStepData.page || 'Current location'}
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
                Skip
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all duration-200"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  // Load current user on component mount
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user) {
      setSettings(prev => ({
        ...prev,
        accountType: user.accountType
      }))
    }
  }, [])
  
  const [settings, setSettings] = useState({
    // Account settings
    accountType: 'free' as 'free' | 'pro' | 'venue',
    
    // Notification settings
    pushNotifications: true,
    emailNotifications: true,
    reviewNotifications: true,
    eventNotifications: true,
    friendRequestNotifications: true,
    marketingEmails: false,
    
    // Privacy settings
    profileVisibility: 'public',
    locationSharing: true,
    trustScoreVisible: true,
    
    // App settings
    darkMode: false,
    language: 'English',
    
    // Location settings
    autoLocation: true,
    showLocationInProfile: true
  })

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleAccountTypeChange = (newType: 'free' | 'pro' | 'venue') => {
    setSettings(prev => ({
      ...prev,
      accountType: newType
    }))
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        enabled ? 'bg-cyan-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    children 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description?: string; 
    children: React.ReactNode 
  }) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <div className="text-slate-600">{icon}</div>
        <div>
          <h3 className="font-medium text-slate-800">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        {/* Account Type */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-cyan-500" />
            Account Type
          </h2>
          
          <div className="space-y-3">
            {/* Free Account */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                settings.accountType === 'free' 
                  ? 'border-cyan-500 bg-cyan-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => handleAccountTypeChange('free')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    🆓 Free Account
                    {settings.accountType === 'free' && (
                      <span className="ml-2 text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">Current</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-600">Basic access, 20 invitations per event</p>
                </div>
                <div className="text-xl font-bold text-slate-800">$0</div>
              </div>
            </div>

            {/* Pro Account */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                settings.accountType === 'pro' 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => handleAccountTypeChange('pro')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    👑 Pro Account
                    {settings.accountType === 'pro' && (
                      <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-full">Current</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-600">Professional reputation management</p>
                  <p className="text-xs text-slate-500">Dual-layer visibility for clients</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800">$9.99</div>
                  <div className="text-xs text-slate-500">/month</div>
                </div>
              </div>
            </div>

            {/* Venue Account */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                settings.accountType === 'venue' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => handleAccountTypeChange('venue')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    🏢 Venue Account
                    {settings.accountType === 'venue' && (
                      <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Current</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-600">Customer relationship management</p>
                  <p className="text-xs text-slate-500">Advanced analytics & outreach tools</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800">$29.99</div>
                  <div className="text-xs text-slate-500">/month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <BellIcon className="w-5 h-5 mr-2 text-cyan-500" />
            Notifications
          </h2>
          
          <div className="space-y-1">
            <SettingItem
              icon={<span className="text-lg">📱</span>}
              title="Push Notifications"
              description="Get notified about important activity"
            >
              <ToggleSwitch 
                enabled={settings.pushNotifications} 
                onToggle={() => handleToggle('pushNotifications')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">📧</span>}
              title="Email Notifications"
              description="Receive updates via email"
            >
              <ToggleSwitch 
                enabled={settings.emailNotifications} 
                onToggle={() => handleToggle('emailNotifications')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">⭐</span>}
              title="Review Notifications"
              description="When someone reviews you"
            >
              <ToggleSwitch 
                enabled={settings.reviewNotifications} 
                onToggle={() => handleToggle('reviewNotifications')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">📅</span>}
              title="Event Notifications"
              description="Event updates and reminders"
            >
              <ToggleSwitch 
                enabled={settings.eventNotifications} 
                onToggle={() => handleToggle('eventNotifications')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">👥</span>}
              title="Friend Requests"
              description="New friend request notifications"
            >
              <ToggleSwitch 
                enabled={settings.friendRequestNotifications} 
                onToggle={() => handleToggle('friendRequestNotifications')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">📈</span>}
              title="Marketing Emails"
              description="Tips and feature updates"
            >
              <ToggleSwitch 
                enabled={settings.marketingEmails} 
                onToggle={() => handleToggle('marketingEmails')} 
              />
            </SettingItem>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-cyan-500" />
            Privacy & Security
          </h2>
          
          <div className="space-y-1">
            <SettingItem
              icon={<span className="text-lg">🌍</span>}
              title="Profile Visibility"
              description="All profiles are public on ScoopSocials"
            >
              <span className="text-sm text-slate-500">Public</span>
            </SettingItem>

            <SettingItem
              icon={<MapPinIcon className="w-5 h-5" />}
              title="Location Sharing"
              description="Share your location with friends"
            >
              <ToggleSwitch 
                enabled={settings.locationSharing} 
                onToggle={() => handleToggle('locationSharing')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">⭐</span>}
              title="Trust Score Visible"
              description="Show your trust score to others"
            >
              <ToggleSwitch 
                enabled={settings.trustScoreVisible} 
                onToggle={() => handleToggle('trustScoreVisible')} 
              />
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">📍</span>}
              title="Auto-Detect Location"
              description="Automatically detect your location"
            >
              <ToggleSwitch 
                enabled={settings.autoLocation} 
                onToggle={() => handleToggle('autoLocation')} 
              />
            </SettingItem>
          </div>
        </div>

        {/* App Settings */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Cog6ToothIcon className="w-5 h-5 mr-2 text-cyan-500" />
            App Settings
          </h2>
          
          <div className="space-y-1">
            <SettingItem
              icon={<SunIcon className="w-5 h-5" />}
              title="Appearance"
              description="Light mode (Dark mode coming soon)"
            >
              <span className="text-sm text-slate-500">Light</span>
            </SettingItem>

            <SettingItem
              icon={<span className="text-lg">🌐</span>}
              title="Language"
              description="App display language"
            >
              <span className="text-sm text-slate-500">English</span>
            </SettingItem>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Account Actions</h2>
          
          <div className="space-y-3">
            {/* Platform Walkthrough Button */}
            <button
              onClick={() => setShowWalkthrough(true)}
              className="flex items-center justify-between w-full p-4 hover:bg-cyan-50 rounded-xl transition-colors duration-200 border-l-4 border-cyan-500"
            >
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="w-5 h-5 text-cyan-600" />
                <div className="text-left">
                  <span className="font-medium text-cyan-700">🎓 Platform Walkthrough</span>
                  <p className="text-xs text-cyan-600">Learn how to use ScoopSocials effectively</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-cyan-400" />
            </button>

            <Link
              href="/moderator"
              className="flex items-center justify-between p-4 hover:bg-orange-50 rounded-xl transition-colors duration-200 border-l-4 border-orange-500"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <span className="font-medium text-orange-700">🛡️ Moderator Inbox</span>
                  <p className="text-xs text-orange-600">Review flagged content</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-orange-400" />
            </Link>

            <Link
              href="/analytics"
              className="flex items-center justify-between p-4 hover:bg-purple-50 rounded-xl transition-colors duration-200 border-l-4 border-purple-500"
            >
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="font-medium text-purple-700">📊 Business Analytics</span>
                  <p className="text-xs text-purple-600">Real-time insights & event tracking</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-purple-400" />
            </Link>

            <Link
              href="/profile/edit"
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-800">Edit Profile</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </Link>

            <Link
              href="/billing"
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-800">Billing & Payments</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </Link>

            <Link
              href="/help"
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <QuestionMarkCircleIcon className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-800">Help & Support</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </Link>

            <button 
              onClick={() => {
                // Clear any stored user data (if any)
                localStorage.clear()
                sessionStorage.clear()
                // Redirect to sign-in page
                window.location.href = '/signin'
              }}
              className="flex items-center justify-between w-full p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-800">Sign Out</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </button>

            <button 
              onClick={() => {
                const confirmed = window.confirm(
                  'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
                )
                if (confirmed) {
                  // In a real app, this would call an API to delete the account
                  alert('Account deletion is not implemented in this demo. Please contact support.')
                }
              }}
              className="flex items-center justify-between w-full p-4 hover:bg-red-50 rounded-xl transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <TrashIcon className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-600 group-hover:text-red-700">Delete Account</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="card-soft text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🍦</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">ScoopSocials</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Version 1.0.0</p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <Link href="/terms" className="hover:text-cyan-600">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-cyan-600">Privacy Policy</Link>
            <Link href="/about" className="hover:text-cyan-600">About</Link>
          </div>
        </div>
      </div>

      {/* Walkthrough Modal */}
      <WalkthroughModal 
        isOpen={showWalkthrough} 
        onClose={() => setShowWalkthrough(false)} 
      />
    </Layout>
  )
} 