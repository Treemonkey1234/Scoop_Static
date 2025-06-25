'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  CogIcon,
  UserPlusIcon 
} from '@heroicons/react/24/outline'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isVerified?: boolean
  trustScore?: number
  connectedAccounts?: any[]
}

interface UserProfileProps {
  user?: User | null
  className?: string
}

export default function UserProfile({ user, className = '' }: UserProfileProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false)
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogin = () => {
    setIsLoading(true)
    window.location.href = '/signin'
  }

  const handleSignup = () => {
    setIsLoading(true)
    window.location.href = '/signin'
  }

  const handleLogout = () => {
    setIsLoading(true)
    window.location.href = '/api/auth/logout'
  }

  const handleProfile = () => {
    window.location.href = '/profile'
  }

  const handleSettings = () => {
    window.location.href = '/settings'
  }

  const handleConnectedAccounts = () => {
    window.location.href = '/connected-accounts'
  }

  if (!user) {
    // Not authenticated - show profile icon that redirects to signin
    return (
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <UserIcon className="w-5 h-5 text-slate-600" />
        )}
      </button>
    )
  }

  // Authenticated user - show profile dropdown
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowDropdown(!showDropdown)
        }}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
      >
        <div className="relative">
          <Image
            src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-xl"
          />
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <div className="hidden md:block text-left">
          <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
          <p className="text-slate-600 text-xs">
            Trust Score: {user.trustScore || 75}
          </p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <Image
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-xl"
              />
              <div>
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-slate-600 text-sm">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    Trust Score: {user.trustScore || 75}
                  </span>
                  {user.isVerified && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          {user.connectedAccounts && user.connectedAccounts.length > 0 && (
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2">Connected Accounts</p>
              <div className="flex space-x-2">
                {user.connectedAccounts.map((account, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {account.provider}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfile}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">View Profile</span>
            </button>
            
            <button
              onClick={handleConnectedAccounts}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <UserPlusIcon className="w-4 h-4" />
              <span className="text-sm">Connected Accounts</span>
            </button>
            
            <button
              onClick={handleSettings}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <CogIcon className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 pt-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="text-sm">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 