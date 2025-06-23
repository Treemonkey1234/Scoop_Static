'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers, addFriend, getCurrentUser, getUserFriends, getMutualFriends, areUsersFriends } from '@/lib/sampleData'
import { 
  UserGroupIcon,
  UserPlusIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

export default function FriendsPage() {
  const currentUser = getCurrentUser()
  const userFriends = getUserFriends(currentUser.id)
  const potentialFriends = sampleUsers.filter(user => 
    user.id !== currentUser.id && !areUsersFriends(currentUser.id, user.id)
  )

  const [isAddingFriend, setIsAddingFriend] = useState<string | null>(null)

  const handleAddFriend = async (friendId: string) => {
    setIsAddingFriend(friendId)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const success = addFriend(friendId)
    if (success) {
      // Trigger a re-render by updating state
      window.location.reload()
    }
    setIsAddingFriend(null)
  }

  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends')
  const [friendRequests, setFriendRequests] = useState([
    { ...sampleUsers[3], mutualFriends: 3 },
    { ...sampleUsers[4], mutualFriends: 1 }
  ])
  const [startX, setStartX] = useState(0)

  const friends = sampleUsers.slice(1, 4) // Marcus, Elena, Alex as friends
  const suggestions = [sampleUsers[4]] // Maya as suggestion

  const handleAcceptRequest = (userId: string) => {
    const success = addFriend(userId)
    if (success) {
      setFriendRequests(prev => prev.filter(user => user.id !== userId))
      // Show success message or update UI
    }
  }

  const handleDeclineRequest = (userId: string) => {
    setFriendRequests(prev => prev.filter(user => user.id !== userId))
  }

  // Tab order for swipe navigation
  const tabOrder: ('friends' | 'requests' | 'suggestions')[] = ['friends', 'requests', 'suggestions']

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      const currentIndex = tabOrder.indexOf(activeTab)
      
      if (diff > 0 && currentIndex < tabOrder.length - 1) {
        // Swipe left - next tab
        setActiveTab(tabOrder[currentIndex + 1])
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous tab
        setActiveTab(tabOrder[currentIndex - 1])
      }
    }
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
            <Link 
              href={`/user/${user.id}`}
              className="hover:text-primary-600 transition-colors duration-200"
            >
              <h3 className="font-semibold text-slate-800">
                {user.name}
              </h3>
            </Link>
            <TrustBadge score={user.trustScore} size="sm" />
          </div>
          <Link 
            href={`/user/${user.id}`}
            className="block hover:text-primary-600 transition-colors duration-200"
          >
            <p className="text-sm text-slate-600 mb-1">@{user.username}</p>
          </Link>
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
              <Link
                href={`/user/${user.id}`}
                className="btn-secondary text-xs px-3 py-2 text-center"
              >
                View Profile
              </Link>
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
            <button 
              onClick={() => handleAddFriend(user.id)}
              className="btn-secondary text-xs px-3 py-2"
            >
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

        {/* Swipe instruction for mobile */}
        <div className="text-center text-sm text-slate-500 mb-4 md:hidden">
          ← Swipe to navigate between tabs →
        </div>

        {/* Content - Swipeable */}
        <div 
          className="space-y-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Your Friends ({userFriends.length})</h3>
                <UserGroupIcon className="w-5 h-5 text-slate-400" />
              </div>
              
              {userFriends.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-2">No friends yet</p>
                  <p className="text-sm text-slate-400">Add some friends to start connecting!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userFriends.map(friend => {
                    const mutualFriends = getMutualFriends(currentUser.id, friend.id)
                    return (
                      <div key={friend.id} className="card-soft flex items-center space-x-4">
                        <Image
                          src={friend.avatar}
                          alt={friend.name}
                          width={48}
                          height={48}
                          className="rounded-xl"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-slate-800">{friend.name}</h4>
                            <TrustBadge score={friend.trustScore} />
                          </div>
                          <p className="text-sm text-slate-500 mb-1">{friend.location}</p>
                          {mutualFriends.length > 0 && (
                            <p className="text-xs text-slate-400">
                              {mutualFriends.length} mutual friend{mutualFriends.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/user/${friend.id}`}
                          className="btn-secondary text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
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

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Friend Suggestions ({potentialFriends.length})</h3>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">New</span>
              </div>
              
              {potentialFriends.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-2">No suggestions available</p>
                  <p className="text-sm text-slate-400">You're already friends with everyone!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {potentialFriends.map(suggestion => {
                    const mutualFriends = getMutualFriends(currentUser.id, suggestion.id)
                    return (
                      <div key={suggestion.id} className="card-soft flex items-center space-x-4">
                        <Image
                          src={suggestion.avatar}
                          alt={suggestion.name}
                          width={48}
                          height={48}
                          className="rounded-xl"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-slate-800">{suggestion.name}</h4>
                            <TrustBadge score={suggestion.trustScore} />
                          </div>
                          <p className="text-sm text-slate-500 mb-1">{suggestion.location}</p>
                          {mutualFriends.length > 0 && (
                            <p className="text-xs text-slate-400">
                              {mutualFriends.length} mutual friend{mutualFriends.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/user/${suggestion.id}`}
                            className="btn-secondary text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleAddFriend(suggestion.id)}
                            disabled={isAddingFriend === suggestion.id}
                            className="btn-primary text-sm disabled:opacity-50"
                          >
                            {isAddingFriend === suggestion.id ? 'Adding...' : 'Add Friend'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
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