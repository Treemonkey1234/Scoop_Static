import React, { useState, useEffect } from 'react'
import { getUserVoteOnReview } from '@/lib/sampleData'

interface VoteSystemProps {
  reviewId: string
  initialVotes?: number
  userVote?: 'up' | 'down' | null
  onVote?: (direction: 'up' | 'down') => void
  className?: string
}

export default function ClassicVoteSystem({ 
  reviewId,
  initialVotes = 0,
  userVote = null,
  onVote,
  className = ''
}: VoteSystemProps) {
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(userVote)

  useEffect(() => {
    const userCurrentVote = getUserVoteOnReview(reviewId)
    setCurrentVote(userCurrentVote)
  }, [reviewId])

  // Update vote state when initialVotes changes (after parent refreshes)
  useEffect(() => {
    const userCurrentVote = getUserVoteOnReview(reviewId)
    setCurrentVote(userCurrentVote)
  }, [initialVotes])

  const handleVote = (direction: 'up' | 'down') => {
    onVote?.(direction)
    // Let parent handle the vote logic and refresh
  }

  return (
    <div className={`flex flex-col items-center space-y-2 py-2 px-3 ${className}`}>
      <button
        onClick={() => handleVote('up')}
        className={`w-8 h-8 flex items-center justify-center rounded text-xl font-bold transition-colors ${
          currentVote === 'up' 
            ? 'bg-gray-200 text-gray-800' 
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        ▲
      </button>
      
      <div className="text-base font-medium text-gray-700">
        {initialVotes}
      </div>
      
      <button
        onClick={() => handleVote('down')}
        className={`w-8 h-8 flex items-center justify-center rounded text-xl font-bold transition-colors ${
          currentVote === 'down' 
            ? 'bg-gray-200 text-gray-800' 
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        ▼
      </button>
    </div>
  )
} 