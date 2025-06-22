'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers } from '@/lib/sampleData'
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const currentUser = sampleUsers[0]
  const [timeRange, setTimeRange] = useState('7d')

  // Mock analytics data
  const analytics = {
    trustScoreTrend: {
      current: currentUser.trustScore,
      change: +5,
      trend: 'up',
      data: [85, 87, 86, 89, 90, 88, 92]
    },
    engagement: {
      postsCreated: 12,
      commentsReceived: 89,
      reactions: 234,
      profileViews: 156,
      friendRequests: 8
    },
    social: {
      connectedAccounts: 8,
      verifiedAccounts: 6,
      totalFollowers: 1249,
      crossPlatformEngagement: 78
    },
    community: {
      eventsAttended: 3,
      eventsHosted: 1,
      helpfulFlags: 23,
      communityContributions: 45
    }
  }

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ]

  const engagementMetrics = [
    {
      title: 'Posts Created',
      value: analytics.engagement.postsCreated,
      change: '+3',
      trend: 'up',
      icon: ChatBubbleLeftIcon,
      color: 'cyan'
    },
    {
      title: 'Profile Views',
      value: analytics.engagement.profileViews,
      change: '+24',
      trend: 'up', 
      icon: EyeIcon,
      color: 'teal'
    },
    {
      title: 'Reactions Received',
      value: analytics.engagement.reactions,
      change: '+18',
      trend: 'up',
      icon: HeartIcon,
      color: 'blue'
    },
    {
      title: 'Friend Requests',
      value: analytics.engagement.friendRequests,
      change: '+2',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'indigo'
    }
  ]

  const socialMetrics = [
    {
      title: 'Connected Accounts',
      value: `${analytics.social.connectedAccounts}/8`,
      description: 'Social platforms linked',
      icon: '🌐',
      progress: (analytics.social.connectedAccounts / 8) * 100
    },
    {
      title: 'Verified Accounts',
      value: `${analytics.social.verifiedAccounts}/8`,
      description: 'Verified social accounts',
      icon: '✅',
      progress: (analytics.social.verifiedAccounts / 8) * 100
    },
    {
      title: 'Total Followers',
      value: analytics.social.totalFollowers.toLocaleString(),
      description: 'Across all platforms',
      icon: '👥',
      progress: 85
    },
    {
      title: 'Cross-Platform Engagement',
      value: `${analytics.social.crossPlatformEngagement}%`,
      description: 'Platform interaction score',
      icon: '📊',
      progress: analytics.social.crossPlatformEngagement
    }
  ]

  const achievements = [
    { title: 'Verified Professional', icon: '💼', description: 'LinkedIn verified' },
    { title: 'Community Leader', icon: '🏆', description: '10+ events hosted' },
    { title: 'Trusted Reviewer', icon: '⭐', description: '50+ helpful reviews' },
    { title: 'Early Adopter', icon: '🚀', description: 'Joined in 2023' }
  ]

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Your Analytics
          </h1>
          <p className="text-slate-600">Track your community impact and growth</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-cyan-200">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Score Overview */}
        <div className="card-premium bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrophyIcon className="w-6 h-6 text-cyan-500" />
              <h2 className="text-xl font-bold text-slate-800">Trust Score Performance</h2>
            </div>
            <TrustBadge score={analytics.trustScoreTrend.current} size="lg" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{analytics.trustScoreTrend.current}</div>
              <div className="text-sm text-slate-500">Current Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center ${
                analytics.trustScoreTrend.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {analytics.trustScoreTrend.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                )}
                {analytics.trustScoreTrend.change > 0 ? '+' : ''}{analytics.trustScoreTrend.change}
              </div>
              <div className="text-sm text-slate-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">Top 15%</div>
              <div className="text-sm text-slate-500">Platform Rank</div>
            </div>
          </div>

          {/* Simple Trust Score Trend Chart */}
          <div className="bg-white/80 rounded-xl p-4 border border-cyan-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">7-Day Trend</h3>
            <div className="flex items-end space-x-1 h-16">
              {analytics.trustScoreTrend.data.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-teal-600 rounded-t opacity-70 hover:opacity-100 transition-opacity duration-200"
                  style={{ height: `${(value / 100) * 100}%` }}
                  title={`Day ${index + 1}: ${value}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>7 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card-premium">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-amber-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-sm font-semibold text-slate-800">{achievement.title}</span>
                </div>
                <p className="text-xs text-slate-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="card-premium">
          <div className="flex items-center space-x-3 mb-6">
            <ChartBarIcon className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl font-bold text-slate-800">Engagement Metrics</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className={`p-4 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100/50 rounded-xl border border-${metric.color}-200`}>
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</div>
                <div className="text-sm text-slate-600">{metric.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Analytics */}
        <div className="card-premium">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-2xl">🌐</span>
            <h2 className="text-xl font-bold text-slate-800">Social Media Impact</h2>
          </div>

          <div className="space-y-4">
            {socialMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{metric.icon}</span>
                    <div>
                      <div className="text-lg font-bold text-slate-800">{metric.value}</div>
                      <div className="text-sm text-slate-600">{metric.title}</div>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-500">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Contributions */}
        <div className="card-premium">
          <div className="flex items-center space-x-3 mb-6">
            <UserGroupIcon className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl font-bold text-slate-800">Community Impact</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Events</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {analytics.community.eventsAttended + analytics.community.eventsHosted}
              </div>
              <div className="text-xs text-slate-600">
                {analytics.community.eventsAttended} attended • {analytics.community.eventsHosted} hosted
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🚩</span>
                <span className="text-sm font-medium text-slate-700">Helpful Flags</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{analytics.community.helpfulFlags}</div>
              <div className="text-xs text-slate-600">Community moderation contributions</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-slate-800 mb-1">Community Contributions</div>
                <div className="text-sm text-slate-600">Total helpful actions this month</div>
              </div>
              <div className="text-3xl font-bold text-green-600">{analytics.community.communityContributions}</div>
            </div>
          </div>
        </div>

        {/* Trust Score Improvement Tips */}
        <div className="card-premium bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-bold text-slate-800">Boost Your Trust Score</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span className="text-sm text-slate-700">Connect more social accounts (Currently {analytics.social.connectedAccounts}/8)</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span className="text-sm text-slate-700">Attend community events to increase engagement</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-700">Write more detailed and helpful reviews</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 