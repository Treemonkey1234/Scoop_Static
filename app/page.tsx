'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import ClassicVoteSystem from '@/components/ClassicVoteSystem'

import { 
  ChatBubbleLeftIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  FlagIcon,
  TagIcon,
  UserIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// User interface for typing
interface User {
  id: number
  name: string
  username?: string
  avatar_url?: string
  trust_score: number
  location?: string
}

// Review interface for typing
interface Review {
  id: string
  author: User
  content: string
  rating: number
  timestamp: string
  category: string
  votes: { up: number; down: number }
  userVote?: 'up' | 'down'
}

// Backend Status Component
function BackendStatus() {
  const [health, setHealth] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    import('../lib/api').then(({ healthAPI }) => {
      healthAPI.checkHealth()
        .then(data => {
          setHealth(data)
          setIsLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setIsLoading(false)
        })
    })
  }, [])

  if (isLoading) return <div className="bg-blue-100 border border-blue-300 text-blue-700 px-3 py-2 rounded-md text-sm">Testing backend connection...</div>
  if (error) return <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm">Backend error: {error}</div>

  return (
    <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md text-sm mb-4">
      <div className="flex items-center space-x-2">
        <span>✅ Backend connected: {health.status}</span>
        <span className="text-xs opacity-75">({health.version})</span>
      </div>
    </div>
  )
}

// Auth0 Status Component
function Auth0Status() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user || null)
        setIsLoading(false)
      })
      .catch(() => {
        setUser(null)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="bg-blue-100 border border-blue-300 text-blue-700 px-3 py-2 rounded-md text-sm">Checking authentication...</div>
  }

  if (user) {
    return (
      <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md text-sm">
        <div className="flex items-center justify-between">
          <span>✅ Signed in as: {(user as any).name || (user as any).email}</span>
          <a href="/api/auth/logout" className="text-red-600 hover:text-red-800 text-xs">Sign out</a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-3 py-2 rounded-md text-sm">
      <div className="flex items-center justify-between">
        <span>⚠️ Not signed in</span>
        <a href="/api/auth/login" className="text-blue-600 hover:text-blue-800 text-xs">Sign in</a>
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [flagModalOpen, setFlagModalOpen] = useState(false)
  const [flagTarget, setFlagTarget] = useState<{type: 'post' | 'event' | 'social' | 'comment', id: string} | null>(null)

  // Initialize empty data
  useEffect(() => {
    // For now, just set empty data and loading to false
    // Real API integration will come next
    setReviews([])
    setEvents([])
    setCurrentUser(null)
    setIsLoading(false)
  }, [])

  const handleVote = (reviewId: string) => (direction: 'up' | 'down') => {
    // Placeholder for voting functionality
    console.log(`Vote ${direction} on review ${reviewId}`)
    // Future: Call backend API to handle voting
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const openFlagModal = (type: 'post' | 'event' | 'social' | 'comment', id: string) => {
    setFlagTarget({type, id})
    setFlagModalOpen(true)
  }

  return (
    <Layout>
      <div className="space-y-4 p-4">
        {/* Backend and Auth Status for Testing */}
        <BackendStatus />
        <Auth0Status />

        {/* Enhanced Welcome Header */}
        <div className="card-premium text-center">
          <div className="mb-6">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="text-4xl">🍨</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Welcome to Scoop
              </h1>
              <div className="text-4xl">🚀</div>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              The trust-based social platform where authentic connections drive meaningful conversations. 
              Build your reputation, discover local events, and connect with verified community members.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Link href="/create-post" className="action-card">
              <div className="text-2xl mb-2">✍️</div>
              <div className="text-sm font-medium">Create Post</div>
            </Link>
            <Link href="/events" className="action-card">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-medium">Find Events</div>
            </Link>
            <Link href="/friends" className="action-card">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Connect</div>
            </Link>
            <Link href="/discover" className="action-card">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-sm font-medium">Discover</div>
            </Link>
          </div>

          {/* Trust Score Info */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">⭐</span>
              <h3 className="text-lg font-semibold text-slate-800">Build Your Trust Score</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Connect verified accounts, attend events, and receive positive reviews to unlock premium features!
            </p>
            <div className="text-xs text-slate-500">
              💡 Pro tip: Connect 3+ verified social accounts to access premium networking features
            </div>
          </div>
        </div>

        {/* Community Feed */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ChatBubbleLeftIcon className="w-5 h-5 mr-2 text-cyan-500" />
            Community Feed
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-6">
                Be the first to share a review or experience with the community!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/create-post"
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  ✍️ Create First Post
                </Link>
                <Link
                  href="/events"
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  📅 Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={review.author.avatar_url || '/default-avatar.png'}
                        alt={review.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-slate-800">{review.author.name}</h4>
                          <TrustBadge score={review.author.trust_score} size="sm" />
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <span>{formatTimestamp(review.timestamp)}</span>
                          <span>•</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">{review.category}</span>
                          {review.author.location && (
                            <>
                              <span>•</span>
                              <MapPinIcon className="w-3 h-3" />
                              <span>{review.author.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openFlagModal('post', review.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <FlagIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= review.rating ? 'text-yellow-400' : 'text-slate-300'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-slate-600">({review.rating}/5)</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <ClassicVoteSystem
                      reviewId={review.id}
                      initialVotes={review.votes.up - review.votes.down}
                      onVote={handleVote(review.id)}
                      userVote={review.userVote}
                    />
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-colors">
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        <span className="text-sm">Reply</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-colors">
                        <ShareIcon className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-colors">
                        <BookmarkIcon className="w-4 h-4" />
                        <span className="text-sm">Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trending Events Preview */}
        <div className="card-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-purple-500" />
              Trending Events
            </h2>
            <Link href="/events" className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No events yet</h3>
              <p className="text-slate-500 mb-4">
                Be the first to create an event in your community!
              </p>
              <Link
                href="/create-event"
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                📅 Create Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-800">{event.title}</h4>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-1">
                      <MapPinIcon className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UsersIcon className="w-3 h-3" />
                      <span>{event.attendees?.length || 0} attending</span>
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="text-xs text-cyan-500 hover:text-cyan-600 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flag Modal */}
        {flagModalOpen && flagTarget && (
          <FlagModal
            isOpen={flagModalOpen}
            onClose={() => setFlagModalOpen(false)}
            contentType={flagTarget.type}
            contentId={flagTarget.id}
          />
        )}
      </div>
    </Layout>
  )
} 