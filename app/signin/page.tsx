'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignInPage() {
  const [formData, setFormData] = useState({
    phoneOrUsername: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleVerificationChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`verification-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowVerification(true)
    }, 1000)
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to home page
      window.location.href = '/'
    }, 1000)
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🍦</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Get the Scoop
              </span>
            </h1>
          </div>

          {/* Phone Verification Form */}
          <div className="card-soft bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl">
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Verify Your Phone</h2>
                <p className="text-slate-600">Enter the 6-digit code sent to {formData.phoneOrUsername}</p>
              </div>

              {/* Verification Code Inputs */}
              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verification-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerificationChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-cyan-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                    required
                  />
                ))}
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading || verificationCode.some(digit => !digit)}
                className={`w-full btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Continue'
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                ← Back to Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🍦</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Get the Scoop
            </span>
          </h1>
          
          <div className="card-soft bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-600">to ScoopSocials</p>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="card-soft bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone/Username Field */}
            <div className="space-y-2">
              <label htmlFor="phoneOrUsername" className="block text-sm font-medium text-slate-700">
                📱 Phone Number or Username
              </label>
              <input
                type="text"
                id="phoneOrUsername"
                name="phoneOrUsername"
                value={formData.phoneOrUsername}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567 or @username"
                className="w-full p-3 rounded-xl border border-cyan-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••"
                  className="w-full p-3 pr-12 rounded-xl border border-cyan-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">Don't have an account?</p>
              <Link
                href="/signup"
                className="w-full btn-secondary block text-center border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                Create Account
              </Link>
              
              {/* Social Login Options */}
              <div className="mt-6">
                <p className="text-sm text-slate-600 mb-4">Continue with social:</p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => window.location.href = '/api/auth/login?connection=google-oauth2'}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">Google</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/api/auth/login?connection=facebook'}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">Facebook</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/api/auth/login?connection=linkedin'}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0A66C2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Enhanced Features Section */}
        <div className="card-soft bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl mt-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <span className="text-2xl block mb-2">🛡️</span>
              <p className="text-xs text-slate-600">Secure & Private</p>
            </div>
            <div>
              <span className="text-2xl block mb-2">🤝</span>
              <p className="text-xs text-slate-600">Community Trust</p>
            </div>
            <div>
              <span className="text-2xl block mb-2">⭐</span>
              <p className="text-xs text-slate-600">Verified Reviews</p>
            </div>
          </div>
          
          {/* About Section Link */}
          <div className="text-center">
            <Link
              href="/about"
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium underline"
            >
              Learn more about our platform →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-500">
          © 2025 ScoopSocials • <Link href="/terms" className="hover:text-cyan-600">Terms</Link> • <Link href="/privacy" className="hover:text-cyan-600">Privacy</Link>
        </div>
      </div>
    </div>
  )
} 