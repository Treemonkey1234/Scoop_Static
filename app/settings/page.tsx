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



export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load current user on component mount
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user) {
      // Determine account type based on trust score
      const accountType = user.trustScore >= 80 ? 'pro' : 
                         user.trustScore >= 60 ? 'venue' : 'free'
      setSettings(prev => ({
        ...prev,
        accountType
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
              onClick={() => {
                // Trigger global walkthrough
                window.dispatchEvent(new CustomEvent('triggerWalkthrough'))
              }}
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
              href="/settings/unified-profile-engine"
              className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-colors duration-200 border-l-4 border-gradient-to-r from-indigo-500 to-purple-600"
              style={{ borderLeftColor: '#6366f1' }}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <div>
                  <span className="font-medium bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">🧬 Unified Profile Engine</span>
                  <p className="text-xs text-indigo-600">Cross-platform identity analytics showcase</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-indigo-400" />
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


    </Layout>
  )
} 