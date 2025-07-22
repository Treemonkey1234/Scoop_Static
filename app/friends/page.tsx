'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import {
  UserGroupIcon,
  UserPlusIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends')
  const [friends, setFriends] = useState<any[]>([])
  const [friendRequests, setFriendRequests] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // For now, just clear the fake data and show empty state
    // Real API integration will come next
    setFriends([])
    setFriendRequests([])
    setIsLoading(false)
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading...</div>
        </div>
      )
    }

    if (activeTab === 'friends') {
      if (friends.length === 0) {
        return (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No friends yet</h3>
            <p className="text-slate-500 mb-6">Connect with people to start building your network!</p>
            <Link
              href="/search"
              className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Find People
            </Link>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.id} className="card-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={friend.avatar_url || '/default-avatar.png'}
                    alt={friend.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-slate-800">{friend.name}</h4>
                    <p className="text-sm text-slate-500">{friend.location}</p>
                  </div>
                </div>
                <TrustBadge score={friend.trust_score} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'requests') {
      if (friendRequests.length === 0) {
        return (
          <div className="text-center py-12">
            <UserPlusIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No friend requests</h3>
            <p className="text-slate-500">When people send you friend requests, they'll appear here.</p>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {friendRequests.map((request) => (
            <div key={request.id} className="card-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={request.avatar_url || '/default-avatar.png'}
                    alt={request.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-slate-800">{request.name}</h4>
                    <p className="text-sm text-slate-500">{request.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Suggestions tab
    return (
      <div className="text-center py-12">
        <StarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-800 mb-2">No suggestions available</h3>
        <p className="text-slate-500">Friend suggestions will appear here as the platform grows.</p>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Friends</h1>
              <p className="text-slate-600">Connect and build your network</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-cyan-500" />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
            {[
              { id: 'friends', label: `Friends (${friends.length})` },
              { id: 'requests', label: `Requests (${friendRequests.length})` },
              { id: 'suggestions', label: 'Suggestions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-cyan-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Call to Action */}
        <div className="card-soft text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Grow Your Network</h3>
          <p className="text-slate-600 mb-4">
            Share your invite link to connect with friends and colleagues
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/invite"
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              📲 Invite Friends
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              🔍 Find People
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
} 