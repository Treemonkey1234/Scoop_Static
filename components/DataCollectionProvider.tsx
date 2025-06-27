'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { dataReservoir, privacyUtils } from '@/lib/dataReservoir'
import { XMarkIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface DataCollectionContextType {
  isConsentGiven: boolean
  requestConsent: () => void
  trackPageView: (page: string, metadata?: any) => void
  trackInteraction: (type: string, target: string, metadata?: any) => void
  trackSearch: (query: string, filters?: any) => void
  trackEvent: (eventId: string, action: string, eventData?: any) => void
  exportData: () => any
}

const DataCollectionContext = createContext<DataCollectionContextType | null>(null)

export const useAnalytics = () => {
  const context = useContext(DataCollectionContext)
  if (!context) {
    throw new Error('useAnalytics must be used within DataCollectionProvider')
  }
  return context
}

interface ConsentModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="w-6 h-6 text-cyan-600" />
            <h2 className="text-xl font-bold text-slate-800">Data Collection</h2>
          </div>
          <button
            onClick={onDecline}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-slate-600">
            Help us improve ScoopSocials and discover better events by sharing anonymous usage data.
          </p>

          <div className="bg-cyan-50 rounded-xl p-4">
            <h3 className="font-semibold text-cyan-800 mb-2">📊 What We Collect:</h3>
            <ul className="text-sm text-cyan-700 space-y-1">
              <li>• Page views and interaction patterns</li>
              <li>• Event interests and search queries</li>
              <li>• General location (city/state only)</li>
              <li>• Engagement metrics (anonymized)</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2">🔒 Your Privacy:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• No personal information collected</li>
              <li>• All data is anonymized</li>
              <li>• You can opt-out anytime</li>
              <li>• Used only for platform improvement</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-2">🚀 Future Benefits:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Better event recommendations</li>
              <li>• Improved local business partnerships</li>
              <li>• Enhanced platform features</li>
              <li>• Potential revenue sharing opportunities</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
          >
            No Thanks
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all"
          >
            Accept & Continue
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          By accepting, you agree to our enhanced data collection for platform improvement and potential future monetization opportunities.
        </p>
      </div>
    </div>
  )
}

export const DataCollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConsentGiven, setIsConsentGiven] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = privacyUtils.getUserConsent()
    setIsConsentGiven(existingConsent)
    setHasCheckedConsent(true)

    // Show consent modal if no consent given and it's been 30 seconds
    if (!existingConsent) {
      const timer = setTimeout(() => {
        setShowConsentModal(true)
      }, 30000) // 30 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const requestConsent = () => {
    setShowConsentModal(true)
  }

  const handleAcceptConsent = () => {
    privacyUtils.setUserConsent(true)
    setIsConsentGiven(true)
    setShowConsentModal(false)
  }

  const handleDeclineConsent = () => {
    privacyUtils.setUserConsent(false)
    setIsConsentGiven(false)
    setShowConsentModal(false)
  }

  const trackPageView = (page: string, metadata?: any) => {
    if (isConsentGiven) {
      dataReservoir.trackPageView(page, metadata)
    }
  }

  const trackInteraction = (type: string, target: string, metadata?: any) => {
    if (isConsentGiven) {
      dataReservoir.trackInteraction(type, target, metadata)
    }
  }

  const trackSearch = (query: string, filters?: any) => {
    if (isConsentGiven) {
      dataReservoir.trackSearchQuery(query, filters)
    }
  }

  const trackEvent = (eventId: string, action: string, eventData?: any) => {
    if (isConsentGiven) {
      dataReservoir.trackEventInteraction(eventId, action, eventData)
    }
  }

  const exportData = () => {
    if (isConsentGiven) {
      return dataReservoir.exportForPlatforms()
    }
    return null
  }

  if (!hasCheckedConsent) {
    return <div>Loading...</div>
  }

  return (
    <DataCollectionContext.Provider 
      value={{
        isConsentGiven,
        requestConsent,
        trackPageView,
        trackInteraction,
        trackSearch,
        trackEvent,
        exportData
      }}
    >
      {children}
      <ConsentModal 
        isOpen={showConsentModal}
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />
    </DataCollectionContext.Provider>
  )
} 