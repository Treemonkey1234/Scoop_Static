'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers } from '@/lib/sampleData'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'people' | 'location'>('people')
  const [trustFilter, setTrustFilter] = useState<number>(0)
  const [showFilters, setShowFilters] = useState(false)

  const filteredUsers = sampleUsers.filter(user => {
    const matchesQuery = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTrust = trustFilter === 0 || user.trustScore >= trustFilter
    
    return matchesQuery && matchesTrust
  })

  const recentSearches = [
    'Sarah Chen',
    'UX Designers in SF', 
    'Personal Trainers',
    'Austin Events'
  ]

  const popularCategories = [
    { name: 'Professionals', icon: '💼', count: 234 },
    { name: 'Event Hosts', icon: '🎉', count: 156 },
    { name: 'Service Providers', icon: '🔧', count: 189 },
    { name: 'Venues', icon: '🏢', count: 67 }
  ]

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Search</h1>
          <p className="text-slate-600">Find trusted people and places in your community</p>
        </div>

        {/* Search Bar */}
        <div className="card-soft">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for people, places, or skills..."
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-3 p-1 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Search Type Toggle */}
          <div className="flex space-x-1 mb-4 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSearchType('people')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                searchType === 'people'
                  ? 'bg-white text-primary-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>People</span>
            </button>
            <button
              onClick={() => setSearchType('location')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                searchType === 'location'
                  ? 'bg-white text-primary-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <MapPinIcon className="w-4 h-4" />
              <span>Location</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
              <h3 className="font-semibold text-slate-800">Filters</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Trust Score: {trustFilter}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trustFilter}
                  onChange={(e) => setTrustFilter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Any</span>
                  <span>Excellent (85+)</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setTrustFilter(0)
                  setShowFilters(false)
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Results ({filteredUsers.length})
              </h2>
              {trustFilter > 0 && (
                <span className="text-sm text-slate-500">
                  Trust score {trustFilter}+
                </span>
              )}
            </div>
            
            {filteredUsers.length > 0 ? (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <Link
                    key={user.id}
                    href={`/user/${user.id}`}
                    className="card-soft transition-all duration-200 block"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={56}
                          height={56}
                          className="rounded-xl"
                        />
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{user.name}</h3>
                          <TrustBadge score={user.trustScore} size="sm" />
                        </div>
                        <p className="text-sm text-slate-600 mb-1">@{user.username}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{user.bio}</p>
                        <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{user.location}</span>
                          <span>•</span>
                          <span>{user.friendsCount} friends</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.accountType === 'pro' 
                            ? 'bg-amber-100 text-amber-700'
                            : user.accountType === 'venue'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.accountType === 'pro' && '👑 Pro'}
                          {user.accountType === 'venue' && '🏢 Venue'}
                          {user.accountType === 'free' && '🆓 Free'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-soft text-center py-12">
                <MagnifyingGlassIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No results found</h3>
                <p className="text-slate-500">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            <div className="card-soft">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="flex items-center space-x-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                  >
                    <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="card-soft">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(category.name)}
                    className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 hover:from-primary-100 hover:to-primary-200/50 rounded-xl transition-all duration-200 text-left"
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">{category.name}</h4>
                    <p className="text-xs text-slate-600">{category.count} members</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="card-soft">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Search Tips</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500">💡</span>
                  <span>Use keywords like "designer", "trainer", or "chef" to find professionals</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500">📍</span>
                  <span>Search by location: "San Francisco", "Austin", or "Denver"</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500">⭐</span>
                  <span>Filter by trust score to find the most reliable members</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
} 