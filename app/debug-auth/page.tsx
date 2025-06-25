'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'

export default function DebugAuth() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessionData()
  }, [])

  const fetchSessionData = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      setSessionData(data)
      console.log('Session Data:', data)
    } catch (error) {
      console.error('Error fetching session:', error)
      setSessionData({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
          <p>Loading session data...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Auth0 Debug Information</h1>
        
        <div className="space-y-6">
          {/* Session Data */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Current Session</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>

          {/* User Information */}
          {sessionData?.session && (
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">User Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {sessionData.session.name || 'N/A'}</p>
                <p><strong>Email:</strong> {sessionData.session.email || 'N/A'}</p>
                <p><strong>Sub:</strong> {sessionData.session.sub || 'N/A'}</p>
                <p><strong>Picture:</strong> {sessionData.session.picture ? 'Yes' : 'No'}</p>
                <p><strong>Email Verified:</strong> {sessionData.session.email_verified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          {/* Identities */}
          {sessionData?.session?.identities && (
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Identities</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(sessionData.session.identities, null, 2)}
              </pre>
            </div>
          )}

          {/* No Identities Warning */}
          {sessionData?.session && !sessionData.session.identities && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 text-yellow-800">⚠️ No Identities Found</h2>
              <p className="text-yellow-700">
                The user session doesn't include an 'identities' array. This might be why connected accounts aren't showing up.
              </p>
            </div>
          )}

          {/* No Session Warning */}
          {!sessionData?.session && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 text-red-800">❌ No Session Found</h2>
              <p className="text-red-700">
                No Auth0 session detected. You might not be logged in, or the session has expired.
              </p>
            </div>
          )}

          {/* Test Actions */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Test Actions</h2>
            <div className="space-x-2">
              <button 
                onClick={fetchSessionData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Refresh Session Data
              </button>
              <a 
                href="/api/auth/login"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
              >
                Login with Auth0
              </a>
              <a 
                href="/api/auth/login?connection=linkedin"
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 inline-block"
              >
                Login with LinkedIn
              </a>
              <a 
                href="/api/auth/logout"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 inline-block"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 