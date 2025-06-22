'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { createNewUser, saveCurrentUser } from '@/lib/sampleData'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    over18: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Please agree to the terms and conditions'
    }
    
    if (!formData.over18) {
      newErrors.over18 = 'You must be 18 or older to create an account'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowVerification(true)
    }, 1500)
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
          // Simulate verification and create new user account
      setTimeout(() => {
        // Create new user with form data
        const newUser = createNewUser({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        })
        
        // Save the new user as current user
        saveCurrentUser(newUser)
        
        setIsLoading(false)
        // Set flag for new user walkthrough
        localStorage.setItem('isNewUser', 'true')
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
                <p className="text-slate-600">Enter the 6-digit code sent to {formData.phone}</p>
                <p className="text-sm text-cyan-600 mt-2">Phone verification helps keep our community secure and boosts your Trust Score!</p>
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
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-cyan-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 bg-white"
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                ← Back to Registration
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">ScoopSocials</h1>
          </div>
          <p className="text-slate-600 mb-2">Trust-Based Social</p>
          
          <div className="card-soft bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Create Your Account</h2>
            <p className="text-slate-600">Join the trust-based community</p>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="card-soft bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                👤 Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-cyan-200 transition-all duration-200 ${
                  errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-cyan-200 focus:border-cyan-500'
                }`}
                required
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                📧 Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-cyan-200 transition-all duration-200 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-cyan-200 focus:border-cyan-500'
                }`}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                📱 Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-cyan-200 transition-all duration-200 ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-cyan-200 focus:border-cyan-500'
                }`}
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
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
                  className={`w-full p-3 pr-12 rounded-xl border bg-white focus:ring-2 focus:ring-cyan-200 transition-all duration-200 ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-cyan-200 focus:border-cyan-500'
                  }`}
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
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-xs text-slate-500">Password must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                🔒 Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••"
                  className={`w-full p-3 pr-12 rounded-xl border bg-white focus:ring-2 focus:ring-cyan-200 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-cyan-200 focus:border-cyan-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Age Verification */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="over18"
                  name="over18"
                  checked={formData.over18}
                  onChange={handleInputChange}
                  className="mt-1 rounded border-cyan-300 text-cyan-600 focus:ring-cyan-500"
                  required
                />
                <div className="flex-1">
                  <label htmlFor="over18" className="text-sm text-slate-700">
                    I am 18 years or older
                  </label>
                  {errors.over18 && (
                    <p className="text-sm text-red-600 mt-1">{errors.over18}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 rounded border-cyan-300 text-cyan-600 focus:ring-cyan-500"
                  required
                />
                <div className="flex-1">
                  <label htmlFor="agreeToTerms" className="text-sm text-slate-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-cyan-600 hover:text-cyan-700 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 underline">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600 mt-1">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 