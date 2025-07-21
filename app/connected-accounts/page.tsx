'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import SocialIcon from '@/components/SocialIcon'
import { getCurrentUser, connectSocialAccount, socialPlatforms } from '@/lib/sampleData'
import { 
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function ConnectedAccounts() {
  const [currentUser] = useState(() => getCurrentUser())
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [usernameInput, setUsernameInput] = useState('')

  // Sample connected accounts to match the ASCII design
  const connectedAccounts = [
    { platform: 'Facebook', handle: '@johnsmith2024', connectedSince: 'March 2024', icon: '📘' },
    { platform: 'Twitter', handle: '@john_smith', connectedSince: 'March 2024', icon: '🐦' },
    { platform: 'Instagram', handle: '@johnsmith_photos', connectedSince: 'April 2024', icon: '📷' },
    { platform: 'LinkedIn', handle: 'John Smith', connectedSince: 'February 2024', icon: '💼' },
    { platform: 'Spotify', handle: 'John Smith', connectedSince: 'May 2024', icon: '🎵' },
    { platform: 'YouTube', handle: '@JohnSmithVlogs', connectedSince: 'January 2024', icon: '▶️' },
    { platform: 'TikTok', handle: '@johnsmith2024', connectedSince: 'June 2024', icon: '📱' },
    { platform: 'Discord', handle: 'JohnSmith#1234', connectedSince: 'April 2024', icon: '🎮' }
  ]

  const availablePlatforms = Object.keys(socialPlatforms).filter(platform => 
    !connectedAccounts.some(account => account.platform.toLowerCase() === platform.toLowerCase())
  )

  const handleConnect = (platform: string, username: string) => {
    if (currentUser && username.trim()) {
      connectSocialAccount(platform, currentUser.id, username)
      setSelectedPlatform(null)
      setUsernameInput('')
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-lg transition-colors mr-4">
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Connected Accounts</h1>
        </div>

        {/* Connected Accounts List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6">
            {connectedAccounts.map((account, index) => (
              <div key={index} className="flex items-center py-4 border-b border-slate-100 last:border-b-0">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
                  <SocialIcon platform={account.platform} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 text-lg">{account.platform}</h3>
                  <p className="text-slate-600">{account.handle}</p>
                  <p className="text-sm text-slate-500">Connected since: {account.connectedSince}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connect More Accounts Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setSelectedPlatform('new')}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-4 rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Connect More Accounts</span>
          </button>
        </div>

        {/* Connect New Platform Modal */}
        {selectedPlatform && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Connect New Account</h2>
              
              {selectedPlatform === 'new' ? (
                <div className="space-y-4">
                  <p className="text-slate-600 mb-4">Select a platform to connect:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePlatforms.slice(0, 8).map(platform => (
                      <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className="p-4 border border-slate-200 rounded-xl hover:border-cyan-300 hover:bg-cyan-50 transition-colors text-center"
                      >
                        <SocialIcon platform={platform} size={32} className="mx-auto mb-2" />
                        <span className="text-sm font-medium text-slate-700">{platform}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <SocialIcon platform={selectedPlatform} size={48} className="mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-slate-800">{selectedPlatform}</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Username/Handle
                    </label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder={`@username or handle`}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => handleConnect(selectedPlatform, usernameInput)}
                      disabled={!usernameInput.trim()}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Connect Account
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setSelectedPlatform(null)
                  setUsernameInput('')
                }}
                className="w-full mt-4 px-4 py-3 text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 