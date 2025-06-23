'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import DragVoteSystem from '@/components/DragVoteSystem'
import ClassicVoteSystem from '@/components/ClassicVoteSystem'

import { getCurrentUser, sampleUsers, getAllReviews, getAllEvents, User, voteOnReview } from '@/lib/sampleData'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ChatBubbleLeftIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  FlagIcon,
  TagIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'



export default function HomePage() {
  const [votedPosts, setVotedPosts] = useState<{[key: string]: 'up' | 'down' | null}>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  const [refreshing, setRefreshing] = useState(false)

  const [flagModal, setFlagModal] = useState<{
    isOpen: boolean
    contentType: 'post' | 'event' | 'social' | 'comment'
    contentId: string
    contentTitle?: string
  }>({
    isOpen: false,
    contentType: 'post',
    contentId: '',
    contentTitle: ''
  })

  // Load current user, reviews, and events on component mount
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Clear localStorage to force fresh timeline order
    localStorage.removeItem('scoopReviews')
    localStorage.removeItem('scoopEvents')
    
    const allReviews = getAllReviews()
    setReviews(allReviews)
    const allEvents = getAllEvents()
    setEvents(allEvents)
  }, [])

  // Refresh reviews when page becomes visible (returning from create post)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const allReviews = getAllReviews()
        setReviews(allReviews)
        const allEvents = getAllEvents()
        setEvents(allEvents)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])



  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleVote = (reviewId: string) => (direction: 'up' | 'down') => {
    // Update the vote in state
    setVotedPosts(prev => ({
      ...prev,
      [reviewId]: direction
    }))

    // Update the review votes
    const success = voteOnReview(reviewId, direction)
    if (success) {
      // Refresh reviews to show updated vote counts
      const updatedReviews = getAllReviews()
      setReviews(updatedReviews)
    }
  }

  const handleComment = (postId: string) => {
    // Navigate to comments page for this post
    window.location.href = `/comments/${postId}`
  }

  const handleFlag = (contentType: 'post' | 'event' | 'social' | 'comment', contentId: string, contentTitle?: string) => {
    setFlagModal({
      isOpen: true,
      contentType,
      contentId,
      contentTitle
    })
  }

  const closeFlagModal = () => {
    setFlagModal({
      isOpen: false,
      contentType: 'post',
      contentId: '',
      contentTitle: ''
    })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // Reload reviews and events from storage
    const allReviews = getAllReviews()
    setReviews(allReviews)
    const allEvents = getAllEvents()
    setEvents(allEvents)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const getPostDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const loadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Helper function to limit content preview
  const limitContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (isLoading && !refreshing) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-4 p-4">

        {/* Enhanced Welcome Header */}
        <div className="card-premium relative overflow-hidden bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent mb-2">
                  Welcome back, {currentUser?.name}! 
                </h2>
                                  <div className="flex items-center space-x-4">
                    <TrustBadge score={currentUser?.trustScore || 50} size="lg" />
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{currentUser?.friendsCount || 0}</span> friends • 
                      <span className="font-medium ml-1">{currentUser?.reviewsCount || 0}</span> reviews
                    </div>
                  </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {refreshing ? (
                  <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Latest Scoops Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Latest Scoops</h3>
          </div>

          {reviews.map((review, index) => {
            const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
            const reviewee = sampleUsers.find(u => u.id === review.reviewedId)
            const currentVote = votedPosts[review.id]
            const relatedEvent = review.isEventReview ? events.find(e => e.id === review.eventId) : null

            if (!reviewer || !reviewee) return null

            return (
              <div key={review.id} className="card-premium hover:shadow-xl transition-all duration-300 border-cyan-200/50 overflow-hidden">
                <div className="flex">
                  {/* Left Voting Section */}
                  <div className="mr-4 self-stretch w-12">
                    <ClassicVoteSystem
                      initialVotes={review.upvotes - review.downvotes}
                      userVote={currentVote}
                      onVote={handleVote(review.id)}
                    />
                  </div>

                  {/* Main Content - Option 2: Vertical Stack with Sidebar */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-3 border-l-4 border-cyan-400">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={reviewer.avatar}
                          alt={reviewer.name}
                          width={40}
                          height={40}
                          className="rounded-lg shadow-sm flex-shrink-0"
                        />
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-slate-800 text-base">{reviewer.name}</h4>
                          <span className="text-slate-400 text-sm">→</span>
                          <span className="font-medium text-slate-700 text-base">{reviewee.name}</span>
                          <div className="bg-white/80 rounded-full">
                            <TrustBadge score={reviewer.trustScore} size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="bg-white rounded-lg p-3 mb-3 border border-slate-200">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full font-medium text-sm">
                          {review.category}
                        </span>
                        {review.isEventReview && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium flex items-center space-x-1 text-sm">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Event Review</span>
                          </span>
                        )}
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{getPostDate(review.timestamp)}</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full flex items-center space-x-1 text-sm">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{reviewer.location}</span>
                        </span>
                      </div>
                      
                      {/* Event Information - Full Width */}
                      {review.isEventReview && relatedEvent && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <CalendarIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span className="font-medium text-purple-800 text-sm">Event: {relatedEvent.title}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-purple-600">
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                              <span>{relatedEvent.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                              <span>{new Date(relatedEvent.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UsersIcon className="w-3 h-3 flex-shrink-0" />
                              <span>{relatedEvent.attendeeCount} attended</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-3 border-l-4 border-cyan-400">
                      <blockquote className="text-slate-700 leading-relaxed">
                        "{limitContentPreview(review.content, 150)}"
                      </blockquote>
                    </div>

                    {/* Actions Section */}
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleComment(review.id)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200"
                          >
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Comment</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200">
                            <ShareIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Share</span>
                          </button>
                          
                          {/* Flag Button - Bottom Right */}
                          <button 
                            onClick={() => handleFlag('post', review.id, `Review by ${reviewer.name}`)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition-all duration-200"
                            title="Flag this content"
                          >
                            <FlagIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Flag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner type="pull-refresh" />
          </div>
        ) : (
          <button 
            onClick={loadMore}
            className="btn-primary w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-700 opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 font-semibold">Load More Scoops 🍨</span>
          </button>
        )}
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={flagModal.isOpen}
        onClose={closeFlagModal}
        contentType={flagModal.contentType}
        contentId={flagModal.contentId}
        contentTitle={flagModal.contentTitle}
      />

    </Layout>
  )
} 