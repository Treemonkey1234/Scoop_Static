import React, { useState } from 'react'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

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
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Auto-parse URL to extract domain and username
  const parseUrl = (input: string) => {
    try {
      // Handle various URL formats
      let url = input.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace('www.', '')
      
      // Extract username from common patterns
      const pathParts = urlObj.pathname.split('/').filter(part => part && part !== '')
      const extractedUsername = pathParts[0] || ''
      
      return { domain, username: extractedUsername }
    } catch {
      return null
    }
  }

  // Validate website URL
  const validateWebsite = (input: string) => {
    if (!input.trim()) {
      setIsValidUrl(null)
      return
    }

    const parsed = parseUrl(input)
    if (parsed) {
      setIsValidUrl(true)
      if (parsed.username && !username) {
        setUsername(parsed.username)
      }
    } else {
      setIsValidUrl(false)
    }
  }

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWebsite(value)
    validateWebsite(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (website.trim() && username.trim() && isValidUrl) {
      setIsConnecting(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const parsed = parseUrl(website)
      const cleanDomain = parsed?.domain || website.trim()
      
      onConnect(cleanDomain, username.trim())
      setWebsite('')
      setUsername('')
      setIsValidUrl(null)
      setIsConnecting(false)
      onClose()
    }
  }

  const examplePlatforms = [
    { name: 'Pinterest', url: 'pinterest.com/username' },
    { name: 'Behance', url: 'behance.net/username' },
    { name: 'Medium', url: 'medium.com/@username' },
    { name: 'DeviantArt', url: 'deviantart.com/username' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Connect Custom Platform</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isConnecting}
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Platform URL or Website
            </label>
            <div className="relative">
              <input
                type="text"
                id="website"
                value={website}
                onChange={handleWebsiteChange}
                placeholder="e.g., pinterest.com/yourname or https://medium.com/@yourname"
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  isValidUrl === false ? 'border-red-300 bg-red-50' : 
                  isValidUrl === true ? 'border-green-300 bg-green-50' : 
                  'border-gray-300'
                }`}
                required
                disabled={isConnecting}
              />
              {isValidUrl !== null && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValidUrl ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {isValidUrl === false && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
            )}
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
              disabled={isConnecting}
            />
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Popular platforms:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {examplePlatforms.map((platform, index) => (
                <div key={index} className="text-xs">
                  <span className="font-medium">{platform.name}:</span> {platform.url}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              disabled={isConnecting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!website.trim() || !username.trim() || isValidUrl === false || isConnecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                isConnecting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : website.trim() && username.trim() && isValidUrl !== false
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white hover:shadow'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                'Connect Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomPlatformModal 