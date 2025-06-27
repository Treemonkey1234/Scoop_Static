'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { sampleUsers, getUserFriends, getMutualFriends } from '@/lib/sampleData'
import { 
  ChevronLeftIcon,
  UserGroupIcon,
  UserPlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

export default function FriendsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'mutual' | 'friends'>('followers')
  
  const user = sampleUsers.find(u => u.id === userId)
  const currentUser = sampleUsers[0] // Test User
  
  if (!user) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">User Not Found</h1>
          <p className="text-slate-600 mb-4">This user doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </Layout>
    )
  }

  // For demo purposes, we'll simulate different friend types
  const allUsers = sampleUsers.filter(u => u.id !== userId)
  const userFriends = getUserFriends(userId)
  const mutualFriends = getMutualFriends(currentUser.id, userId)
  
  // Simulate followers (people who follow this user)
  const followers = allUsers.slice(0, Math.floor(allUsers.length * 0.7))
  
  // Simulate following (people this user follows)
  const following = allUsers.slice(0, Math.floor(allUsers.length * 0.6))
  
  // Real friends (mutual following)
  const realFriends = userFriends

  const renderUserCard = (person: any, showAddFriend = true) => (
    <div key={person.id} className="p-4 bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center space-x-3 mb-3">
        <Link href={`/user/${person.id}`}>
          <Image
            src={person.avatar}
            alt={person.name}
            width={48}
            height={48}
            className="rounded-xl hover:opacity-80 transition-opacity"
          />
        </Link>
        <div className="flex-1">
          <Link href={`/user/${person.id}`} className="hover:text-cyan-600 transition-colors">
            <h4 className="font-semibold text-slate-800">{person.name}</h4>
          </Link>
          <p className="text-sm text-slate-600">@{person.name.toLowerCase().replace(/\s+/g, '_')}</p>
          <p className="text-xs text-slate-500">{person.location} • Trust: {person.trustScore}</p>
        </div>
      </div>
      
      {person.bio && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{person.bio}</p>
      )}
      
      {showAddFriend && (
        <div className="flex space-x-2">
          <button className="flex-1 btn-secondary text-sm py-2">
            <UserPlusIcon className="w-4 h-4 mr-1" />
            Add Friend
          </button>
          <Link
            href={`/create-post?reviewFor=${person.id}`}
            className="flex-1 btn-primary flex items-center justify-center text-sm py-2"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Review
          </Link>
        </div>
      )}
    </div>
  )

  const getTabContent = () => {
    switch (activeTab) {
      case 'followers':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              People who follow {user.name} ({followers.length})
            </p>
            <div className="space-y-3">
              {followers.map(person => renderUserCard(person))}
            </div>
          </div>
        )
      
      case 'following':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              People {user.name} follows ({following.length})
            </p>
            <div className="space-y-3">
              {following.map(person => renderUserCard(person))}
            </div>
          </div>
        )
      
      case 'mutual':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Friends you both have ({mutualFriends.length})
            </p>
            <div className="space-y-3">
              {mutualFriends.map(person => (
                <div key={person.id} className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <Link href={`/user/${person.id}`}>
                      <Image
                        src={person.avatar}
                        alt={person.name}
                        width={48}
                        height={48}
                        className="rounded-xl hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/user/${person.id}`} className="hover:text-cyan-600 transition-colors">
                        <h4 className="font-semibold text-slate-800">{person.name}</h4>
                      </Link>
                      <p className="text-sm text-slate-600">@{person.name.toLowerCase().replace(/\s+/g, '_')}</p>
                      <p className="text-xs text-cyan-600 font-medium">🤝 Mutual friend</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/user/${person.id}`} className="flex-1 btn-secondary text-sm py-2 text-center">
                      View Profile
                    </Link>
                    <button className="flex-1 btn-primary text-sm py-2">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'friends':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              {user.name}'s friends - mutual following ({realFriends.length})
            </p>
            <div className="space-y-3">
              {realFriends.map(person => (
                <div key={person.id} className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <Link href={`/user/${person.id}`}>
                      <Image
                        src={person.avatar}
                        alt={person.name}
                        width={48}
                        height={48}
                        className="rounded-xl hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/user/${person.id}`} className="hover:text-green-600 transition-colors">
                        <h4 className="font-semibold text-slate-800">{person.name}</h4>
                      </Link>
                      <p className="text-sm text-slate-600">@{person.name.toLowerCase().replace(/\s+/g, '_')}</p>
                      <p className="text-xs text-green-600 font-medium">💚 {user.name} and {person.name} follow each other</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/user/${person.id}`} className="flex-1 btn-secondary text-sm py-2 text-center">
                      View Profile
                    </Link>
                    <button className="flex-1 btn-primary text-sm py-2">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-800">{user.name}'s Friends</h1>
            <p className="text-sm text-slate-600">{user.location} • {user.friendsCount} connections</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card-soft">
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'followers'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Followers
              <div className="text-xs text-slate-500">({followers.length})</div>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'following'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Following
              <div className="text-xs text-slate-500">({following.length})</div>
            </button>
            <button
              onClick={() => setActiveTab('mutual')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'mutual'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Mutual
              <div className="text-xs text-slate-500">({mutualFriends.length})</div>
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Friends
              <div className="text-xs text-slate-500">({realFriends.length})</div>
            </button>
          </div>

          {/* Tab Content */}
          {getTabContent()}
        </div>
      </div>
    </Layout>
  )
} 