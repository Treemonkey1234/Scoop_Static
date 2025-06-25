'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { sampleUsers, createNewReview, getCurrentUser, areUsersFriends, getUserFriends } from '@/lib/sampleData'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  TagIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

function CreatePostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reviewForId = searchParams?.get('reviewFor')
  const reviewForUser = reviewForId ? sampleUsers.find(u => u.id === reviewForId) : null
  
  const currentUser = getCurrentUser()
  const userFriends = getUserFriends(currentUser.id)

  const [formData, setFormData] = useState({
    reviewFor: reviewForUser?.id || '',
    category: '',
    content: '',
    tags: [] as string[],
    photo: null as File | null
  })

  const [friendSearch, setFriendSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 5 streamlined categories from our discussion
  const categories = [
    { id: 'professional', label: '💼 Professional', emoji: '💼' },
    { id: 'marketplace', label: '🛒 Marketplace', emoji: '🛒' },
    { id: 'dating', label: '💕 Dating', emoji: '💕' },
    { id: 'social', label: '🤝 Social', emoji: '🤝' },
    { id: 'general', label: '🔗 General', emoji: '🔗' }
  ]

  // Quick suggested tags
  const quickTags = ['#reliable', '#skilled', '#responsive', '#professional', '#recommended']

  // Recent friends (top 3 for minimal design)
  const recentFriends = userFriends.slice(0, 3).map(friend => ({
    id: friend.id,
    name: friend.name,
    trustScore: friend.trustScore
  }))

  const filteredFriends = userFriends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearch.toLowerCase())
  )

  const selectedUser = formData.reviewFor ? 
    userFriends.find(f => f.id === formData.reviewFor) || 
    sampleUsers.find(u => u.id === formData.reviewFor) : null

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.reviewFor || !formData.category || !formData.content.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      createNewReview({
        reviewedId: formData.reviewFor,
        category: formData.category,
        content: formData.content,
        location: '',
        tags: formData.tags
      })

      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/')
    } catch (error) {
      console.error('Error creating review:', error)
      setIsSubmitting(false)
    }
  }

  const characterCount = formData.content.length
  const maxCharacters = 300

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl shadow-soft">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">✨ Quick Review</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!formData.reviewFor || !formData.category || !formData.content.trim() || isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            {isSubmitting ? '✨' : '📤'}
            <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Who */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />
              <span>👤 WHO?</span>
            </h3>
            
            {/* Friend Search */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search: Alex M..."
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                />
                <div className="absolute right-3 top-3 text-slate-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Friends List */}
            <div className="space-y-2">
              {(friendSearch ? filteredFriends.slice(0, 3) : recentFriends).map((friend) => (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, reviewFor: friend.id }))}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    formData.reviewFor === friend.id
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      📍 {friend.name} {formData.reviewFor === friend.id && '✓ Selected'}
                    </span>
                    <span className="text-sm text-slate-600">({friend.trustScore})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* What About */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📝 WHAT ABOUT?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.category === category.id
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {category.label}
                  {formData.category === category.id && (
                    <div className="mt-1 text-xs text-cyan-600">████</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Your Review */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">✍️ YOUR REVIEW</h3>
            
            <textarea
              placeholder={selectedUser ? 
                `${selectedUser.name} was amazing to work with on our React project. Super responsive and delivered quality code on time. Would definitely collaborate again! 🚀` :
                "Alex was amazing to work with on our React project. Super responsive and delivered quality code on time. Would definitely collaborate again! 🚀"
              }
              className="w-full h-28 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              maxLength={maxCharacters}
            />
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-cyan-600 hover:text-cyan-700 cursor-pointer">
                  <PhotoIcon className="w-5 h-5" />
                  <span>📸 Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {formData.photo && (
                  <span className="text-sm text-green-600">✅ {formData.photo.name}</span>
                )}
              </div>
              <span className={`text-sm ${characterCount > maxCharacters * 0.9 ? 'text-orange-600' : 'text-slate-500'}`}>
                {characterCount}/{maxCharacters} chars
              </span>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🏷️ Quick Tags:</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagAdd(tag)}
                  disabled={formData.tags.includes(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    formData.tags.includes(tag)
                      ? 'bg-cyan-100 text-cyan-700 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-all"
                onClick={() => {
                  const customTag = prompt('Enter custom tag (without #):')
                  if (customTag && customTag.trim()) {
                    handleTagAdd(`#${customTag.trim()}`)
                  }
                }}
              >
                + Custom
              </button>
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center space-x-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-cyan-500 hover:text-cyan-700"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <p className="text-sm text-slate-600 text-center">
              🔒 This review will be public • Trust scores may be affected
            </p>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    }>
      <CreatePostContent />
    </Suspense>
  )
} 