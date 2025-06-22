'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-sm mx-auto">
            <div className="card-soft text-center">
              <div className="w-16 h-16 bg-trust-excellent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-trust-excellent" />
              </div>
              
              <h1 className="text-xl font-bold text-slate-800 mb-2">Check your email</h1>
              <p className="text-slate-600 mb-6">
                We've sent a password reset link to {email}
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full btn-secondary"
                >
                  Try different email
                </button>
                
                <Link href="/signin" className="block w-full btn-primary text-center">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/signin" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Reset your password</h1>
            <p className="text-slate-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-soft">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Send reset link
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Remember your password?{' '}
              <Link href="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 