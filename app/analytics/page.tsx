'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { 
  ChartBarIcon,
  UsersIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  const analyticsData = {
    totalUsers: 2847,
    verifiedUsers: 2156,
    botsPrevented: 291,
    trustScore: 87.3,
    eventAttendance: 1243,
    realTimeEngagement: 156
  }

  const recentActivity = [
    { time: '2 min ago', event: 'High-trust user verified', type: 'success' },
    { time: '5 min ago', event: 'Suspicious activity detected', type: 'warning' },
    { time: '8 min ago', event: 'Event check-in: Summer Mixer', type: 'info' },
    { time: '12 min ago', event: 'Bot account flagged', type: 'danger' },
    { time: '15 min ago', event: 'New venue account created', type: 'success' }
  ]

  const engagementMetrics = [
    { label: 'Profile Views', value: 3247, change: '+12%' },
    { label: 'Social Verifications', value: 892, change: '+8%' },
    { label: 'Event RSVPs', value: 456, change: '+24%' },
    { label: 'Trust Score Updates', value: 167, change: '+5%' }
  ]

  return (
    <Layout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-800">Business Analytics</h1>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <p className="text-slate-600">Real-time insights for venue owners and business accounts</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{analyticsData.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Verified Users</p>
                <p className="text-2xl font-bold text-slate-800">{analyticsData.verifiedUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-trust-excellent/10 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-trust-excellent" />
              </div>
            </div>
          </div>

          <div className="card-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Bots Prevented</p>
                <p className="text-2xl font-bold text-slate-800">{analyticsData.botsPrevented}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Trust Score</p>
                <p className="text-2xl font-bold text-slate-800">{analyticsData.trustScore}%</p>
              </div>
              <div className="w-12 h-12 bg-trust-good/10 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-trust-good" />
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Event Tracking */}
        <div className="card-soft mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
            Real-Time Event Tracking
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-primary-50 rounded-xl">
              <p className="text-sm text-primary-600">Current Attendees</p>
              <p className="text-xl font-bold text-primary-700">{analyticsData.eventAttendance}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600">Live Engagement</p>
              <p className="text-xl font-bold text-green-700">{analyticsData.realTimeEngagement}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-slate-700">Active Events</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Summer Networking Mixer</p>
                  <p className="text-sm text-slate-500">Downtown Bar & Grill • 89 attendees</p>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Cooking Workshop</p>
                  <p className="text-sm text-slate-500">Verde Kitchen • 24 attendees</p>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="card-soft mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-primary-500" />
            Engagement Metrics
          </h2>
          
          <div className="space-y-3">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">{metric.label}</span>
                <div className="text-right">
                  <span className="font-bold text-slate-800">{metric.value.toLocaleString()}</span>
                  <span className={`ml-2 text-sm ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card-soft">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-primary-500" />
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{activity.event}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Features CTA */}
        <div className="card-soft mt-6 bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200">
          <div className="text-center">
            <h3 className="font-semibold text-slate-800 mb-2">Upgrade to Business Account</h3>
            <p className="text-sm text-slate-600 mb-4">
              Get advanced analytics, real-time event tracking, and bot prevention tools
            </p>
            <button className="btn-primary">
              Learn More About Business Features
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 