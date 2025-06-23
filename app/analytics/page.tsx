'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers, getCurrentUser, getAllReviews, getAllEvents, getUserActivities } from '@/lib/sampleData'
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
  TrophyIcon,
  FlagIcon
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [timeRange, setTimeRange] = useState('7d')

  // Refresh data when component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCurrentUser(getCurrentUser())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Get dynamic data
  const userReviews = getAllReviews().filter(review => review.reviewerId === currentUser.id)
  const userEvents = getAllEvents().filter(event => event.hostId === currentUser.id)
  const userActivities = getUserActivities().filter(activity => activity.userId === currentUser.id)
  
  // Calculate dynamic metrics
  const totalUpvotes = userReviews.reduce((sum, review) => sum + review.upvotes, 0)
  const recentActivities = userActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return activityDate >= weekAgo
  })

  // Dynamic analytics data
  const analytics = {
    trustScoreTrend: {
      current: currentUser.trustScore,
      change: +5, // This could be calculated from activity history
      trend: 'up',
      data: [85, 87, 86, 89, 90, 88, currentUser.trustScore] // Last value is current
    },
    engagement: {
      postsCreated: currentUser.reviewsCount,
      commentsReceived: totalUpvotes, // Using upvotes as engagement proxy
      reactions: totalUpvotes * 2, // Estimated reactions
      profileViews: Math.min(500, currentUser.trustScore * 5), // Estimated based on trust score
      friendRequests: Math.max(0, currentUser.friendsCount - 50) // Estimated pending requests
    },
    social: {
      connectedAccounts: currentUser.socialAccounts.length,
      verifiedAccounts: currentUser.socialAccounts.filter(account => account.verified).length,
      totalFollowers: Math.min(5000, currentUser.trustScore * 25), // Estimated followers
      crossPlatformEngagement: Math.min(100, currentUser.trustScore - 10) // Engagement percentage
    },
    community: {
      eventsAttended: currentUser.eventsAttended,
      eventsHosted: userEvents.length,
      helpfulFlags: Math.floor(currentUser.trustScore / 4), // Estimated helpful flags
      communityContributions: userReviews.length + userEvents.length + Math.floor(currentUser.friendsCount / 5)
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
      value: `${analytics.social.connectedAccounts}`,
      description: 'Social platforms linked',
      icon: '🌐',
      progress: Math.min((analytics.social.connectedAccounts / 10) * 100, 100)
    },
    {
      title: 'Verified Accounts',
      value: `${analytics.social.verifiedAccounts}`,
      description: 'Verified social accounts',
      icon: '✅',
      progress: Math.min((analytics.social.verifiedAccounts / 10) * 100, 100)
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
                <FlagIcon className="w-5 h-5 text-orange-600" />
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

        {/* Recent Activity */}
        <div className="card-premium">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              Last 7 days
            </span>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity, index) => {
                const getActivityIcon = (activityType: string) => {
                  switch (activityType) {
                    case 'review_created': return '✍️'
                    case 'event_created': return '🎉'
                    case 'event_attended': return '🎪'
                    case 'friend_added': return '👥'
                    case 'profile_completed': return '✅'
                    case 'phone_verified': return '📱'
                    case 'social_connected': return '🔗'
                    case 'account_created': return '🎊'
                    default: return '📝'
                  }
                }

                const getActivityText = (activity: any) => {
                  switch (activity.activity) {
                    case 'review_created': return `Created a review in ${activity.metadata?.category || 'General'}`
                    case 'event_created': return `Created event "${activity.metadata?.eventTitle || 'Untitled'}"`
                    case 'event_attended': return `Attended event "${activity.metadata?.eventTitle || 'Event'}"`
                    case 'friend_added': return 'Added a new friend'
                    case 'profile_completed': return 'Completed profile setup'
                    case 'phone_verified': return 'Verified phone number'
                    case 'social_connected': return `Connected ${activity.metadata?.platform || 'social'} account`
                    case 'account_created': return 'Joined ScoopSocials'
                    default: return activity.activity.replace(/_/g, ' ')
                  }
                }

                const getTimeAgo = (timestamp: string) => {
                  const now = new Date()
                  const activityTime = new Date(timestamp)
                  const diffMs = now.getTime() - activityTime.getTime()
                  const diffMins = Math.floor(diffMs / (1000 * 60))
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

                  if (diffMins < 60) return `${diffMins}m ago`
                  if (diffHours < 24) return `${diffHours}h ago`
                  return `${diffDays}d ago`
                }

                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
                    <div className="text-lg">{getActivityIcon(activity.activity)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{getActivityText(activity)}</p>
                      <p className="text-xs text-slate-500">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No recent activity to show</p>
              <p className="text-xs mt-1">Start creating reviews or attending events to see your activity here!</p>
            </div>
          )}
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
              <span className="text-sm text-slate-700">Connect more social accounts (Currently {analytics.social.connectedAccounts})</span>
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