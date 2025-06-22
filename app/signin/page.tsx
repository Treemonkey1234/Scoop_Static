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
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">ScoopSocials</h1>
            </div>
            <p className="text-slate-600 mb-2">Trust-Based Social</p>
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
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">ScoopSocials</h1>
          </div>
          <p className="text-slate-600 mb-2">Trust-Based Social</p>
          
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
                className="input-field border-cyan-200/50 focus:border-cyan-500 focus:ring-cyan-200"
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
                  className="input-field pr-12 border-cyan-200/50 focus:border-cyan-500 focus:ring-cyan-200"
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
          © 2024 ScoopSocials • <Link href="/terms" className="hover:text-cyan-600">Terms</Link> • <Link href="/privacy" className="hover:text-cyan-600">Privacy</Link>
        </div>
      </div>
    </div>
  )
} 