'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers, createNewReview } from '@/lib/sampleData'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function CreatePostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reviewForId = searchParams?.get('reviewFor')
  const reviewForUser = reviewForId ? sampleUsers.find(u => u.id === reviewForId) : null

  const [formData, setFormData] = useState({
    reviewFor: reviewForUser?.id ? [reviewForUser.id] : [] as string[],
    category: '',
    content: '',
    location: '',
    tags: [] as string[]
  })

  const [friendSearch, setFriendSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Recent friends from ASCII design
  const recentFriends = [
    { id: '2', name: 'Jessica Wong', trustScore: 95 },
    { id: '3', name: 'David Kim', trustScore: 95 },
    { id: '1', name: 'Sarah Chen', trustScore: 89 },
    { id: '4', name: 'Emma Davis', trustScore: 92 }
  ]

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
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ❌ Cancel
          </button>
          <h1 className="text-xl font-bold text-slate-800">Create Post</h1>
          <button
            onClick={handleSubmit}
            disabled={formData.reviewFor.length === 0 || !formData.category || !formData.content}
            className="text-green-600 hover:text-green-700 font-medium disabled:text-slate-400"
          >
            ✅ Post
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Who Are You Reviewing */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-primary-500" />
              👤 WHO ARE YOU REVIEWING?
            </h3>
            
            <>
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  placeholder="Search your friends: Type friend's name..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">✅ SELECTED FRIENDS:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        <span>{user.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            reviewFor: prev.reviewFor.filter(id => id !== user.id) 
                          }))}
                          className="hover:bg-primary-200 rounded-full p-0.5"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">📋 RECENT FRIENDS:</h4>
                <div className="space-y-2">
                  {filteredFriends.map((friend) => (
                    <label
                      key={friend.id}
                      className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.reviewFor.includes(friend.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              reviewFor: [...prev.reviewFor, friend.id] 
                            }))
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              reviewFor: prev.reviewFor.filter(id => id !== friend.id) 
                            }))
                          }
                        }}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span>{friend.name}</span>
                        <span className="text-sm text-slate-500">(Trust: {friend.trustScore})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          </div>

          {/* Review Category */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📝 REVIEW CATEGORY</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.category === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Write Your Review */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">✍️ WRITE YOUR REVIEW</h3>
            
            <div className="space-y-4">
              <p className="text-slate-600">What would you like to share about this person?</p>
              
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Jessica was an incredible collaboration partner on our startup project. Her technical expertise and communication skills made the entire process smooth. Highly recommend working with her on any tech initiative..."
                rows={6}
                className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                maxLength={500}
                required
              />
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{formData.content.length}/500 characters • Be specific and helpful</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
              📍 LOCATION (Optional)
            </h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Phoenix, AZ • WeWork Central"
                className="flex-1 p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200"
              >
                📍
              </button>
              <button
                type="button"
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200"
              >
                🗺️
              </button>
            </div>
          </div>

          {/* Add Tags */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🏷️ ADD TAGS</h3>
            
            <div className="space-y-4">
              <p className="text-slate-600">Add relevant tags to help others find this review:</p>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">🔥 SUGGESTED TAGS:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagAdd(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                        formData.tags.includes(tag)
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Custom tags: #startup, #react, #phoenix"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = (e.target as HTMLInputElement).value.trim()
                      if (value) {
                        const tags = value.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`)
                        tags.forEach(tag => handleTagAdd(tag));
                        (e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">(separate with commas: #startup, #react, #phoenix)</p>
              </div>

              {formData.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Selected:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="hover:bg-primary-200 rounded-full p-0.5"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy & Trust */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary-500" />
              🔒 PRIVACY & TRUST
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-slate-700">This review will be public to your network</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-slate-700">The person being reviewed will be notified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-slate-700">Community validation will determine trust impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-amber-500">⚠️</span>
                <span className="text-slate-700">False or malicious reviews may affect your trust score</span>
              </div>
            </div>
          </div>

          {/* Preview Trust Impact */}
          <div className="card-soft">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-primary-500" />
              📊 PREVIEW TRUST IMPACT
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Your Trust Score:</span>
                <span className="font-medium text-slate-800">95 → Likely 95-96 (positive review)</span>
              </div>
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  {selectedUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-700">{user.name}'s Trust Score:</span>
                      <span className="font-medium text-slate-800">
                        {user.trustScore || 95} → Likely {(user.trustScore || 95) + 1}-{(user.trustScore || 95) + 2} (if validated by community)
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {selectedUsers.length === 0 && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700">Their Trust Score:</span>
                  <span className="font-medium text-slate-800">
                    Select friends to see trust impact preview
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="card-soft">
            <button
              type="submit"
              disabled={isSubmitting || formData.reviewFor.length === 0 || !formData.category || !formData.content}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing Review...</span>
                </div>
              ) : (
                '✅ Publish Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 