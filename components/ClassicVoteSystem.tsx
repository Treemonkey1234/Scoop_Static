import React, { useState, useEffect } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChevronUpIcon as ChevronUpSolid, ChevronDownIcon as ChevronDownSolid } from '@heroicons/react/24/solid'
import { getUserVoteOnReview } from '@/lib/sampleData'

interface VoteSystemProps {
  reviewId: string
  initialVotes?: number
  userVote?: 'up' | 'down' | null
  onVote?: (direction: 'up' | 'down') => void
  className?: string
  showGradient?: boolean
}

export default function ClassicVoteSystem({ 
  reviewId,
  initialVotes = 0,
  userVote = null,
  onVote,
  className = '',
  showGradient = true
}: VoteSystemProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(userVote)
  const [upvotes, setUpvotes] = useState(Math.max(0, Math.floor((initialVotes + 100) * 0.7))) // Simulate upvotes
  const [downvotes, setDownvotes] = useState(Math.max(0, Math.floor((100 - initialVotes) * 0.3))) // Simulate downvotes

  // Load user's current vote state on mount
  useEffect(() => {
    const userCurrentVote = getUserVoteOnReview(reviewId)
    setCurrentVote(userCurrentVote)
  }, [reviewId])

  const handleVote = (direction: 'up' | 'down') => {
    // Optimistic update
    let newVotes = votes
    let newUpvotes = upvotes
    let newDownvotes = downvotes
    
    if (currentVote === direction) {
      // Remove vote
      setCurrentVote(null)
      if (direction === 'up') {
        newVotes -= 1
        newUpvotes -= 1
      } else {
        newVotes += 1
        newDownvotes -= 1
      }
    } else if (currentVote === null) {
      // Add vote
      setCurrentVote(direction)
      if (direction === 'up') {
        newVotes += 1
        newUpvotes += 1
      } else {
        newVotes -= 1
        newDownvotes += 1
      }
    } else {
      // Change vote
      setCurrentVote(direction)
      if (direction === 'up') {
        newVotes += 2
        newUpvotes += 1
        newDownvotes -= 1
      } else {
        newVotes -= 2
        newDownvotes += 1
        newUpvotes -= 1
      }
    }

    setVotes(newVotes)
    setUpvotes(newUpvotes)
    setDownvotes(newDownvotes)
    
    // Call parent handler
    onVote?.(direction)
  }

  // Calculate vote ratio and consensus
  const totalVotes = upvotes + downvotes
  const upvoteRatio = totalVotes > 0 ? upvotes / totalVotes : 0.5
  const consensusPercentage = Math.round(upvoteRatio * 100)

  // Generate dynamic gradient based on vote ratio
  const generateGradient = () => {
    if (!showGradient) return 'bg-gradient-to-b from-slate-50 to-white'
    
    if (consensusPercentage >= 80) {
      // Heavy positive consensus - dark at top
      return 'bg-gradient-to-b from-green-400 via-green-200 via-green-100 to-slate-50'
    } else if (consensusPercentage >= 60) {
      // Medium positive consensus
      return 'bg-gradient-to-b from-green-200 via-green-100 to-slate-50'
    } else if (consensusPercentage >= 40) {
      // Balanced - even gradient
      return 'bg-gradient-to-b from-cyan-100 via-slate-50 to-orange-100'
    } else if (consensusPercentage >= 20) {
      // Medium negative consensus
      return 'bg-gradient-to-b from-slate-50 via-red-100 to-red-200'
    } else {
      // Heavy negative consensus - dark at bottom
      return 'bg-gradient-to-b from-slate-50 via-red-100 via-red-200 to-red-400'
    }
  }

  // Get consensus icon
  const getConsensusIcon = () => {
    if (consensusPercentage >= 80) return '✨'
    if (consensusPercentage >= 60) return '👍'
    if (consensusPercentage >= 40) return '⚖️'
    if (consensusPercentage >= 20) return '👎'
    return '⚠️'
  }

  // Get consensus color
  const getConsensusColor = () => {
    if (consensusPercentage >= 80) return 'text-green-700'
    if (consensusPercentage >= 60) return 'text-green-600'
    if (consensusPercentage >= 40) return 'text-slate-600'
    if (consensusPercentage >= 20) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className={`flex flex-col items-center h-full justify-between py-3 px-2 rounded-l-2xl relative overflow-hidden ${generateGradient()} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center h-full justify-between">
        {/* Upvote Button */}
        <button
          onClick={() => handleVote('up')}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
            currentVote === 'up'
              ? 'text-green-700 bg-green-200/80 shadow-lg ring-2 ring-green-300'
              : 'text-slate-500 hover:text-green-600 hover:bg-green-100/50'
          }`}
        >
          {currentVote === 'up' ? (
            <ChevronUpSolid className="w-6 h-6" />
          ) : (
            <ChevronUpIcon className="w-6 h-6" />
          )}
        </button>

        {/* Vote Count and Ice Cream Icon */}
        <div className="flex flex-col items-center space-y-1">
          {/* Ice Cream Icon */}
          <div className="text-2xl">🍦</div>
          
          {/* Vote Count */}
          <span className={`text-lg font-bold px-2 py-1 rounded-lg bg-white/80 border shadow-sm ${
            currentVote === 'up' 
              ? 'text-green-700 border-green-200'
              : currentVote === 'down'
              ? 'text-red-700 border-red-200'
              : 'text-slate-700 border-slate-200'
          }`}>
            {votes > 0 ? `+${votes}` : votes}
          </span>
          
          {/* Consensus Indicator */}
          {showGradient && totalVotes > 0 && (
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">{getConsensusIcon()}</span>
              <span className={`text-xs font-medium ${getConsensusColor()}`}>
                {consensusPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Downvote Button */}
        <button
          onClick={() => handleVote('down')}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
            currentVote === 'down'
              ? 'text-red-700 bg-red-200/80 shadow-lg ring-2 ring-red-300'
              : 'text-slate-500 hover:text-red-600 hover:bg-red-100/50'
          }`}
        >
          {currentVote === 'down' ? (
            <ChevronDownSolid className="w-6 h-6" />
          ) : (
            <ChevronDownIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  )
} 