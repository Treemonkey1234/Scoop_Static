'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers, createNewReview, getCurrentUser, areUsersFriends, getUserFriends } from '@/lib/sampleData'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CalendarIcon,
  PhotoIcon,
  FlagIcon
} from '@heroicons/react/24/outline'

export default function CreatePostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reviewForId = searchParams?.get('reviewFor')
  const reviewForUser = reviewForId ? sampleUsers.find(u => u.id === reviewForId) : null
  const eventId = searchParams.get('event')
  
  const currentUser = getCurrentUser()
  const userFriends = getUserFriends(currentUser.id)

  // Validate that reviewForUser is a friend if specified
  const canReviewUser = reviewForUser ? areUsersFriends(currentUser.id, reviewForUser.id) : true

  const [formData, setFormData] = useState({
    reviewFor: reviewForUser?.id && canReviewUser ? [reviewForUser.id] : [] as string[],
    category: '',
    content: '',
    location: '',
    tags: [] as string[],
    title: '',
    postType: '',
  })

  const [friendSearch, setFriendSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFriendWarning, setShowFriendWarning] = useState(reviewForUser && !canReviewUser)

  // Categories from ASCII design - Consolidated to 6 essential categories
  const categories = [
    { id: 'professional', label: '💼 Professional', selected: false },
    { id: 'social', label: '🤝 Social & Personal', selected: false },
    { id: 'services', label: '🛠️ Services & Trade', selected: false },
    { id: 'marketplace', label: '🛒 Marketplace & Sales', selected: false },
    { id: 'roommate', label: '🏠 Roommate & Living', selected: false },
    { id: 'academic', label: '🎓 Academic & Learning', selected: false }
  ]

  // Suggested tags from ASCII design
  const suggestedTags = [
    '#reliable', '#responsive', '#professional', '#teamwork', '#skilled',
    '#punctual', '#creative', '#helpful', '#trustworthy', '#experienced'
  ]

  // Recent friends from user's actual friends
  const recentFriends = userFriends.map(friend => ({
    id: friend.id,
    name: friend.name,
    trustScore: friend.trustScore
  }))

  const filteredFriends = recentFriends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearch.toLowerCase())
  )

  const selectedUsers = formData.reviewFor.map(id => 
    recentFriends.find(f => f.id === id) || 
    sampleUsers.find(u => u.id === id)
  ).filter(user => user !== undefined)

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }))
  }

  const handleTagAdd = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new review for each selected friend
      for (const reviewedId of formData.reviewFor) {
        createNewReview({
          reviewedId,
          category: formData.category,
          content: formData.content,
          location: formData.location,
          tags: formData.tags
        })
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Redirect back to home
      router.push('/')
    } catch (error) {
      console.error('Error creating review:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Post</h1>
          <p className="text-slate-600">Share your thoughts, experiences, or ask a question</p>
        </div>

        {/* Friend Warning */}
        {showFriendWarning && reviewForUser && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Friend-Only Reviews</h3>
                <p className="text-amber-700 mb-3">
                  You can only write reviews for people who are your friends. This ensures authentic feedback within trusted networks.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => router.push(`/user/${reviewForUser.id}`)}
                    className="btn-primary text-sm"
                  >
                    Add {reviewForUser.name} as Friend
                  </button>
                  <button
                    onClick={() => setShowFriendWarning(false)}
                    className="btn-secondary text-sm"
                  >
                    Continue Without Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Preview */}
          <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <Image
                src="/avatars/default.png"
                alt="User"
                width={40}
                height={40}
                className="rounded-full"
              />
              
              {/* Post Content */}
              <div className="flex-1">
                {/* Post Header */}
                <div className="flex flex-col space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    className="text-xl font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full min-h-[120px] text-slate-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                {/* Post Metadata */}
                <div className="flex flex-col space-y-2 text-sm text-slate-500">
                  {/* Category */}
                  <div className="flex items-center space-x-2">
                    <TagIcon className="w-4 h-4" />
                    <select
                      className="bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">Select Category</option>
                      <option value="question">Question</option>
                      <option value="discussion">Discussion</option>
                      <option value="review">Review</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>

                  {/* Post Type */}
                  <div className="flex items-center space-x-2">
                    <TagIcon className="w-4 h-4" />
                    <select
                      className="bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                      value={formData.postType}
                      onChange={(e) => setFormData(prev => ({ ...prev, postType: e.target.value }))}
                    >
                      <option value="">Select Post Type</option>
                      <option value="general">General</option>
                      <option value="event-review">Event Review</option>
                      <option value="recommendation">Recommendation</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Add location"
                      className="bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Event Details Box (if reviewing an event) */}
                {eventId && formData.postType === 'event-review' && (
                  <div className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                    <h4 className="font-medium text-cyan-800 mb-2">Event Details</h4>
                    <div className="text-sm text-cyan-600">
                      {/* Event details would be populated here */}
                      <p>Event Name: Sample Event</p>
                      <p>Date: January 1, 2024</p>
                      <p>Location: Sample Location</p>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center space-x-2 text-sm text-cyan-600 hover:text-cyan-700"
                    onClick={() => {/* Handle image upload */}}
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>Add Photos</span>
                  </button>
                </div>

                {/* Flag Button */}
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="p-2 text-slate-400 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors duration-200"
                    onClick={() => {/* Handle flag */}}
                  >
                    <FlagIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 