'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import Image from 'next/image'
import { 
  FlagIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  TrashIcon,
  ExclamationCircleIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  LinkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const flaggedContent = [
  {
    id: '2847',
    type: 'post',
    title: 'POST #2847 - Doxxing Attempt',
    flaggedBy: '@trustuser92',
    flaggerTrust: 89,
    timeAgo: '23 mins ago',
    reason: 'Contains personal address and phone number',
    evidence: ['Screenshot attached', 'IP logs available'],
    contentPreview: 'Sarah lives at 123 Oak St and her number is...',
    urgency: 'urgent',
    actions: ['Review', 'Remove', 'Escalate', 'Contact Flagger']
  },
  {
    id: '1092',
    type: 'event',
    title: 'EVENT #1092 - False Information',
    flaggedBy: '@verifieduser',
    flaggerTrust: 95,
    timeAgo: '1 hour ago',
    reason: 'Event location doesn\'t exist, potential scam',
    evidence: ['Google Maps verification', 'venue contact confirmation'],
    additionalInfo: '3 other users confirmed location is fake',
    urgency: 'urgent',
    actions: ['Review', 'Remove', 'Warn Host', 'Refund Attendees']
  },
  {
    id: '5634',
    type: 'profile',
    title: 'PROFILE #5634 - Suspicious Social Links',
    flaggedBy: '@communitymod',
    flaggerTrust: 87,
    timeAgo: '2 hours ago',
    reason: 'Instagram account appears to be stolen/fake',
    evidence: ['Reverse image search results', 'account creation dates'],
    userResponse: 'These are my real accounts, I can verify',
    urgency: 'pending',
    actions: ['Review', 'Request Verification', 'Approve', 'Remove Link']
  },
  {
    id: '9876',
    type: 'comment',
    title: 'COMMENT #9876 - Unconstructive Content',
    flaggedBy: '@helpfuluser',
    flaggerTrust: 78,
    timeAgo: '3 hours ago',
    reason: 'Off-topic and inflammatory language',
    evidence: ['Full comment thread context provided'],
    contentPreview: 'This is stupid and you\'re all wasting your time...',
    urgency: 'pending',
    actions: ['Review', 'Warning', 'Remove', 'Ignore Flag']
  },
  {
    id: '4421',
    type: 'post',
    title: 'POST #4421 - Misinformation',
    flaggedBy: '@factchecker',
    flaggerTrust: 91,
    timeAgo: '4 hours ago',
    reason: 'Claims about health benefits are medically inaccurate',
    evidence: ['Medical journal citations', 'expert consultation'],
    impact: '47 upvotes, 12 shares - high visibility content',
    urgency: 'pending',
    actions: ['Review', 'Add Warning Label', 'Remove', 'Request Sources']
  }
]

const moderationStats = {
  totalFlags: 47,
  pending: 12,
  resolved: 35,
  urgent: 3,
  totalProcessed: 342,
  avgResponseTime: 2.3,
  falsePositiveRate: 8.2,
  communitySatisfaction: 94,
  trustScoreImpact: 2.1
}

export default function ModeratorPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedBulkAction, setSelectedBulkAction] = useState('')

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50'
      case 'pending':
        return 'border-l-yellow-500 bg-yellow-50'
      default:
        return 'border-l-slate-300 bg-white'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <ChatBubbleLeftIcon className="w-5 h-5" />
      case 'event':
        return <CalendarIcon className="w-5 h-5" />
      case 'profile':
        return <UserIcon className="w-5 h-5" />
      case 'comment':
        return <ChatBubbleLeftIcon className="w-5 h-5" />
      default:
        return <FlagIcon className="w-5 h-5" />
    }
  }

  const urgentFlags = flaggedContent.filter(item => item.urgency === 'urgent')
  const pendingFlags = flaggedContent.filter(item => item.urgency === 'pending')

  return (
    <Layout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
            🛡️ Moderator Inbox
          </h1>
          <p className="text-slate-600">Review flagged content and maintain community standards</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card-soft text-center">
            <div className="text-2xl font-bold text-slate-800">{moderationStats.totalFlags}</div>
            <div className="text-sm text-slate-500">🚩 Total Flags</div>
          </div>
          <div className="card-soft text-center">
            <div className="text-2xl font-bold text-yellow-600">{moderationStats.pending}</div>
            <div className="text-sm text-slate-500">⏰ Pending</div>
          </div>
          <div className="card-soft text-center">
            <div className="text-2xl font-bold text-green-600">{moderationStats.resolved}</div>
            <div className="text-sm text-slate-500">✅ Resolved</div>
          </div>
          <div className="card-soft text-center">
            <div className="text-2xl font-bold text-red-600">{moderationStats.urgent}</div>
            <div className="text-sm text-slate-500">🔥 Urgent</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card-soft mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">🔍 Filter Flags</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'posts', 'events', 'profiles', 'social-links', 'comments', 'urgent', 'new', 'in-review'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeFilter === filter
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <select 
                value={selectedBulkAction} 
                onChange={(e) => setSelectedBulkAction(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="remove">Remove Selected</option>
                <option value="escalate">Escalate Selected</option>
              </select>
              <ChevronDownIcon className="w-4 h-4 text-slate-500" />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors duration-200">
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors duration-200">
              <CogIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors duration-200">
              <QuestionMarkCircleIcon className="w-4 h-4" />
              <span>Help</span>
            </button>
          </div>
        </div>

        {/* Urgent Flags */}
        {urgentFlags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
              🚨 URGENT FLAGS (Requires Immediate Action)
            </h2>
            <div className="space-y-4">
              {urgentFlags.map((flag) => (
                <div key={flag.id} className={`card-soft border-l-4 ${getUrgencyColor(flag.urgency)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-red-500">
                        {getTypeIcon(flag.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">🔴 {flag.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <span>Flagged by: <span className="font-medium">{flag.flaggedBy}</span></span>
                          <span>(Trust: {flag.flaggerTrust})</span>
                          <span>•</span>
                          <span>{flag.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Reason: </span>
                      <span className="text-sm text-slate-600">"{flag.reason}"</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">Evidence: </span>
                      <span className="text-sm text-slate-600">{flag.evidence.join(', ')}</span>
                    </div>
                    {flag.contentPreview && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Content Preview: </span>
                        <span className="text-sm text-slate-600">"{flag.contentPreview}"</span>
                      </div>
                    )}
                    {flag.additionalInfo && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Additional Info: </span>
                        <span className="text-sm text-slate-600">{flag.additionalInfo}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {flag.actions.map((action) => (
                      <button
                        key={action}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          action === 'Remove' || action === 'Escalate'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : action === 'Review'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Review Flags */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            📋 PENDING REVIEW FLAGS
          </h2>
          <div className="space-y-4">
            {pendingFlags.map((flag) => (
              <div key={flag.id} className={`card-soft border-l-4 ${getUrgencyColor(flag.urgency)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-500">
                      {getTypeIcon(flag.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">🟡 {flag.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <span>Flagged by: <span className="font-medium">{flag.flaggedBy}</span></span>
                        <span>(Trust: {flag.flaggerTrust})</span>
                        <span>•</span>
                        <span>{flag.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Reason: </span>
                    <span className="text-sm text-slate-600">"{flag.reason}"</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Evidence: </span>
                    <span className="text-sm text-slate-600">{flag.evidence.join(', ')}</span>
                  </div>
                  {flag.contentPreview && (
                    <div>
                      <span className="text-sm font-medium text-slate-700">Content Preview: </span>
                      <span className="text-sm text-slate-600">"{flag.contentPreview}"</span>
                    </div>
                  )}
                  {flag.userResponse && (
                    <div>
                      <span className="text-sm font-medium text-slate-700">User Response: </span>
                      <span className="text-sm text-slate-600">"{flag.userResponse}"</span>
                    </div>
                  )}
                  {flag.impact && (
                    <div>
                      <span className="text-sm font-medium text-slate-700">Impact: </span>
                      <span className="text-sm text-slate-600">{flag.impact}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {flag.actions.map((action) => (
                    <button
                      key={action}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        action === 'Remove' || action === 'Ignore Flag'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : action === 'Review' || action === 'Approve'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation Stats */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Moderation Stats (Last 30 Days)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Flags Processed:</span>
                <span className="font-semibold">{moderationStats.totalProcessed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Average Response Time:</span>
                <span className="font-semibold">{moderationStats.avgResponseTime} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">False Positive Rate:</span>
                <span className="font-semibold">{moderationStats.falsePositiveRate}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Community Satisfaction:</span>
                <span className="font-semibold text-green-600">{moderationStats.communitySatisfaction}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trust Score Impact:</span>
                <span className="font-semibold text-primary-600">+{moderationStats.trustScoreImpact} average</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-soft mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">💡 Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary">Send Community Update</button>
            <button className="btn-secondary">Generate Weekly Report</button>
            <button className="btn-secondary">Review Guidelines</button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 