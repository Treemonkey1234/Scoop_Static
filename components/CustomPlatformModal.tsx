import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CustomPlatformModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (website: string, username: string) => void
}

const CustomPlatformModal: React.FC<CustomPlatformModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [website, setWebsite] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (website.trim() && username.trim()) {
      onConnect(website.trim(), username.trim())
      setWebsite('')
      setUsername('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Connect Custom Platform</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Platform Website
            </label>
            <input
              type="text"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g., pinterest.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Your Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username on this platform"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Example:</p>
            <p>Website: pinterest.com</p>
            <p>Username: craftlover123</p>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              Connect Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomPlatformModal 