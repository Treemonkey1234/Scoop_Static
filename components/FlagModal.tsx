import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface FlagModalProps {
  isOpen: boolean
  onClose: () => void
  contentType: 'post' | 'event' | 'social' | 'comment'
  contentId: string
  contentTitle?: string
}

const FlagModal: React.FC<FlagModalProps> = ({ 
  isOpen, 
  onClose, 
  contentType, 
  contentId, 
  contentTitle 
}) => {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const flagReasons = {
    post: [
      'Misinformation/False Claims',
      'Doxxing/Privacy Violation',
      'Spam/Promotional Content',
      'Harassment/Bullying',
      'Hate Speech/Discrimination',
      'Inappropriate Content',
      'Fake Review/Manipulation',
      'Off-Topic Content',
      'Copyright Violation',
      'Other'
    ],
    event: [
      'False Location/Venue Information',
      'Scam/Fraudulent Event',
      'Safety Concerns',
      'Inappropriate Content',
      'Spam/Promotional Abuse',
      'Misleading Event Details',
      'Copyright Violation',
      'Other'
    ],
    social: [
      'Stolen/Fake Account',
      'Fake Followers/Engagement',
      'Impersonation',
      'Inappropriate Content',
      'Spam Account',
      'Other'
    ],
    comment: [
      'Harassment/Bullying',
      'Hate Speech/Discrimination',
      'Spam/Promotional Content',
      'Inappropriate Content',
      'Off-Topic Comment',
      'Misinformation/False Claims',
      'Personal Attack',
      'Other'
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message and close
    alert('Flag submitted successfully. Our moderation team will review this content.')
    setIsSubmitting(false)
    onClose()
    
    // Reset form
    setSelectedReason('')
    setDescription('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Flag {contentType === 'post' ? 'Post' : contentType === 'event' ? 'Event' : contentType === 'comment' ? 'Comment' : 'Social Account'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {contentTitle && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Flagging: <span className="font-medium">{contentTitle}</span></p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason for flagging *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {flagReasons[contentType].map((reason) => (
                <label key={reason} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="flagReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-primary-500 border-slate-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context that would help our moderation team..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={3}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> False flags may impact your trust score. Only flag content that violates our community guidelines.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason || isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FlagModal 