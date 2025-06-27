'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { sampleReviews, sampleUsers, getCurrentUser } from '@/lib/sampleData'

export default function AllReviewsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get('tab') === 'by' ? 'by' : 'about'
  const [activeTab, setActiveTab] = useState<'about' | 'by'>(initialTab)
  
  const currentUser = getCurrentUser()
  
  if (!currentUser) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  // Reviews about this user
  const userReviews = sampleReviews.filter(r => r.reviewedId === currentUser.id)
  // Reviews by this user about others
  const reviewsByUser = sampleReviews.filter(review => review.reviewerId === currentUser.id)

  const handleTabChange = (tab: 'about' | 'by') => {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    router.replace(url.pathname + url.search)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/profile"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <StarIcon className="w-6 h-6 mr-2 text-cyan-500" />
              All Reviews
            </h1>
            <p className="text-slate-600">View all reviews about you and reviews you've written</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card-soft">
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => handleTabChange('about')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Reviews About ({userReviews.length})
            </button>
            <button
              onClick={() => handleTabChange('by')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'by'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Reviews By ({reviewsByUser.length})
            </button>
          </div>

          {/* Reviews Content */}
          <div className="space-y-4">
            {activeTab === 'about' ? (
              userReviews.length > 0 ? (
                userReviews.map((review) => {
                  const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
                  return (
                    <div key={review.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={reviewer?.avatar} 
                            alt={reviewer?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-slate-800">{reviewer?.name}</div>
                            <div className="text-sm text-slate-500">
                              {new Date(review.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full font-medium">
                          {review.category}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">"{review.content}"</p>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <StarIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No reviews received yet</h3>
                  <p className="text-sm">Get involved in the community to start receiving reviews!</p>
                </div>
              )
            ) : (
              reviewsByUser.length > 0 ? (
                reviewsByUser.map((review) => {
                  const reviewee = sampleUsers.find(u => u.id === review.reviewedId)
                  return (
                    <div key={review.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={reviewee?.avatar} 
                            alt={reviewee?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm text-slate-600">Review for:</div>
                            <div className="font-medium text-slate-800">{reviewee?.name}</div>
                            <div className="text-sm text-slate-500">
                              {new Date(review.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full font-medium">
                          {review.category}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">"{review.content}"</p>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <StarIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No reviews written yet</h3>
                  <p className="text-sm">Start engaging with other users and write your first review!</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
} 