'use client'

import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import { 
  UserIcon, 
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    bio: 'Food enthusiast and event organizer in Dallas. Love discovering new restaurants and hosting community gatherings. Always looking for authentic experiences and genuine connections.',
    location: 'Dallas, TX',
    website: 'https://sarahjohnson.com',
    birthDate: '1992-03-15',
    gender: 'Female',
    occupation: 'Event Coordinator',
    company: 'Dallas Events Co.',
    interests: ['Food & Dining', 'Community Events', 'Photography', 'Travel']
  })

  const [socialAccounts, setSocialAccounts] = useState([
    { platform: 'Instagram', username: '@saraheats', verified: true, public: true },
    { platform: 'LinkedIn', username: 'sarah-johnson-events', verified: true, public: true },
    { platform: 'Twitter/X', username: '@sarahj_events', verified: false, public: true }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSocialAccountUpdate = (index: number, field: string, value: any) => {
    setSocialAccounts(prev => 
      prev.map((account, i) => 
        i === index ? { ...account, [field]: value } : account
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    }, 1000)
  }

  const availableInterests = [
    'Food & Dining', 'Community Events', 'Photography', 'Travel', 'Music', 'Sports',
    'Technology', 'Art & Culture', 'Fitness', 'Business', 'Education', 'Health & Wellness'
  ]

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Edit Profile</h1>
          <p className="text-slate-600">Update your profile information and preferences</p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-green-800 font-medium">Profile updated successfully!</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="card-soft">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile Photo</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b6c0ca5e?w=400"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors duration-200"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Change Photo
                </button>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card-soft">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell others about yourself..."
                />
                <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="card-soft">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Additional Details</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-slate-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Your job title"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Where you work"
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="card-soft">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Interests</h2>
            <p className="text-sm text-slate-600 mb-4">Select topics you're interested in to help others find you</p>
            
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    formData.interests.includes(interest)
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                      : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Social Media Accounts */}
          <div className="card-soft">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Social Media Accounts</h2>
            
            <div className="space-y-4">
              {socialAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium">{account.platform.charAt(0)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-800">{account.platform}</span>
                      <p className="text-sm text-slate-500">{account.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSocialAccountUpdate(index, 'public', !account.public)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      {account.public ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeSlashIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-300 transition-colors duration-200"
              >
                <span className="text-slate-600">Add Social Media Account</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 