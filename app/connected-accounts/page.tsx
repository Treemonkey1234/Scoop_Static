'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { getCurrentUser, User } from '@/lib/sampleData'
import { 
  ArrowLeftIcon,
  PlusIcon,
  CheckBadgeIcon,
  FlagIcon
} from '@heroicons/react/24/outline'

// Social media platform SVG components
const SocialIcon = ({ platform }: { platform: string }) => {
  const getIcon = () => {
    switch (platform) {
      case 'Facebook':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'Twitter':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        )
      case 'Instagram':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
            <defs>
              <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#833AB4"/>
                <stop offset="50%" stopColor="#FD1D1D"/>
                <stop offset="100%" stopColor="#FCB045"/>
              </linearGradient>
            </defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'LinkedIn':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'GitHub':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      case 'YouTube':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      case 'TikTok':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        )
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#6B7280">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
    }
  }
  
  return <div className="w-6 h-6">{getIcon()}</div>
}

export default function ConnectedAccountsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const handleFlagAccount = (platform: string, handle: string) => {
    // In a real app, this would open a flag modal
    alert(`Flag ${platform} account (${handle}) functionality would open here`)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const availablePlatforms = [
    'Snapchat', 'Pinterest', 'Reddit', 'GitHub', 'Twitch', 'Medium'
  ].filter(platform => !currentUser.socialAccounts.some(account => account.platform === platform))

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link
            href="/profile"
            className="p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Connected Accounts</h1>
        </div>

        {/* Connected Accounts List */}
        <div className="space-y-4">
          {currentUser.socialAccounts.map((account, index) => (
            <div key={index} className="card-soft hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center border border-cyan-200">
                  <SocialIcon platform={account.platform} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-800">{account.platform}</h3>
                    {account.verified && (
                      <CheckBadgeIcon className="w-4 h-4 text-cyan-500" />
                    )}
                  </div>
                  <p className="text-slate-600">{account.handle}</p>
                  <p className="text-sm text-slate-500">Connected since: {formatDate(currentUser.joinDate)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleFlagAccount(account.platform, account.handle)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all duration-200"
                    title="Flag this account"
                  >
                    <FlagIcon className="w-4 h-4" />
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ))}

          {currentUser.socialAccounts.length === 0 && (
            <div className="card-soft text-center py-8">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Connected Accounts</h3>
              <p className="text-slate-600 mb-4">Connect your social media accounts to boost your trust score!</p>
            </div>
          )}
        </div>

        {/* Add More Accounts */}
        {availablePlatforms.length > 0 && (
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Available Platforms</h3>
            <div className="grid grid-cols-2 gap-3">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform}
                  className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200"
                >
                  <SocialIcon platform={platform} />
                  <span className="font-medium text-slate-700">{platform}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connect More Button */}
        <button className="w-full btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 flex items-center justify-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Connect More Accounts</span>
        </button>

        {/* Trust Score Boost Info */}
        <div className="card-soft bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">📈 Boost Your Trust Score</h3>
          <p className="text-slate-600 text-sm mb-3">
            Each verified social media account increases your trust score. Connect more platforms to build community confidence!
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-cyan-700">+10 points</span>
              <span className="text-slate-600"> per account</span>
            </div>
            <div>
              <span className="font-medium text-cyan-700">+5 bonus</span>
              <span className="text-slate-600"> if verified</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 