'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers } from '@/lib/sampleData'
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
  const [friendRequests, setFriendRequests] = useState([
    { ...sampleUsers[3], mutualFriends: 3 },
    { ...sampleUsers[4], mutualFriends: 1 }
  ])

  const currentUser = sampleUsers[0] // Using Sarah as current user
  const friends = sampleUsers.slice(1, 4) // Marcus, Elena, Alex as friends
  const suggestions = [sampleUsers[4]] // Maya as suggestion

  const handleAcceptRequest = (userId: string) => {
    setFriendRequests(prev => prev.filter(user => user.id !== userId))
  }

  const handleDeclineRequest = (userId: string) => {
    setFriendRequests(prev => prev.filter(user => user.id !== userId))
  }

  const renderUserCard = (user: any, type: 'friend' | 'request' | 'suggestion') => (
    <div key={user.id} className="card-soft">
      <div className="flex items-center space-x-4">
        <Link href={`/user/${user.id}`} className="flex-shrink-0">
          <div className="relative">
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              className="rounded-2xl"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Link href={`/user/${user.id}`}>
              <h3 className="font-semibold text-slate-800 hover:text-primary-600 transition-colors duration-200">
                {user.name}
              </h3>
            </Link>
            <TrustBadge score={user.trustScore} size="sm" />
          </div>
          <p className="text-sm text-slate-600 mb-1">@{user.username}</p>
          <p className="text-sm text-slate-500 line-clamp-2">{user.bio}</p>
          
          {user.mutualFriends !== undefined && (
            <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
              <UserGroupIcon className="w-3 h-3" />
              <span>{user.mutualFriends} mutual friends</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
            <span>📍 {user.location}</span>
            <span>•</span>
            <span>{user.friendsCount} friends</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          {type === 'friend' && (
            <>
              <Link
                href={`/create-post?reviewFor=${user.id}`}
                className="btn-primary text-xs px-3 py-2 text-center"
              >
                Review
              </Link>
              <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                <ChatBubbleLeftIcon className="w-4 h-4 text-slate-500" />
              </button>
            </>
          )}
          
          {type === 'request' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleAcceptRequest(user.id)}
                className="p-2 rounded-xl bg-trust-excellent hover:bg-trust-excellent/80 text-white transition-colors duration-200"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeclineRequest(user.id)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {type === 'suggestion' && (
            <button className="btn-secondary text-xs px-3 py-2">
              Add Friend
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Friends</h1>
          <p className="text-slate-600">Your trusted network of connections</p>
        </div>

        {/* Stats */}
        <div className="card-soft">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-800">{friends.length}</div>
              <div className="text-sm text-slate-500">Friends</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{friendRequests.length}</div>
              <div className="text-sm text-slate-500">Requests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{suggestions.length}</div>
              <div className="text-sm text-slate-500">Suggestions</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
          {[
            { key: 'friends', label: 'Friends', count: friends.length },
            { key: 'requests', label: 'Requests', count: friendRequests.length },
            { key: 'suggestions', label: 'Suggestions', count: suggestions.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'friends' && (
            <>
              {friends.length > 0 ? (
                <>
                  <div className="text-sm text-slate-600 mb-4">
                    🔒 <strong>Friends-only reviews:</strong> You can only review people who are your friends, ensuring authentic feedback within your trusted network.
                  </div>
                  {friends.map(friend => renderUserCard(friend, 'friend'))}
                </>
              ) : (
                <div className="card-soft text-center py-12">
                  <UserGroupIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No friends yet</h3>
                  <p className="text-slate-500 mb-6">Start building your trusted network by adding friends</p>
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className="btn-primary"
                  >
                    Find Friends
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              {friendRequests.length > 0 ? (
                <>
                  <div className="text-sm text-slate-600 mb-4">
                    👋 <strong>Friend requests:</strong> People who want to connect with you. Accept to start building trust together!
                  </div>
                  {friendRequests.map(request => renderUserCard(request, 'request'))}
                </>
              ) : (
                <div className="card-soft text-center py-12">
                  <UserPlusIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No pending requests</h3>
                  <p className="text-slate-500">New friend requests will appear here</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'suggestions' && (
            <>
              {suggestions.length > 0 ? (
                <>
                  <div className="text-sm text-slate-600 mb-4">
                    ✨ <strong>Friend suggestions:</strong> People you might know based on mutual connections and shared interests.
                  </div>
                  {suggestions.map(suggestion => renderUserCard(suggestion, 'suggestion'))}
                  
                  {/* Why these suggestions */}
                  <div className="card-soft">
                    <h3 className="font-semibold text-slate-800 mb-3">Why these suggestions?</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span>Mutual friends with people in your network</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span>Similar professional background or interests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span>Located in your area</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span>High trust score members</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card-soft text-center py-12">
                  <StarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No suggestions available</h3>
                  <p className="text-slate-500 mb-6">Check back later for new friend suggestions</p>
                  <Link href="/search" className="btn-primary">
                    Search for People
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Trust Network Info */}
        <div className="card-soft">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
            <span className="text-primary-500 mr-2">🔗</span>
            Your Trust Network
          </h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span>Network Size</span>
              <span className="font-semibold text-slate-800">{friends.length} friends</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span>Average Trust Score</span>
              <span className="font-semibold text-slate-800">
                {Math.round(friends.reduce((acc, friend) => acc + friend.trustScore, 0) / friends.length || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span>Reviews Given</span>
              <span className="font-semibold text-slate-800">24</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span>Reviews Received</span>
              <span className="font-semibold text-slate-800">18</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 