import React, { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChevronUpIcon as ChevronUpSolid, ChevronDownIcon as ChevronDownSolid } from '@heroicons/react/24/solid'

interface VoteSystemProps {
  initialVotes?: number
  userVote?: 'up' | 'down' | null
  onVote?: (direction: 'up' | 'down') => void
  className?: string
}

export default function ClassicVoteSystem({ 
  initialVotes = 0,
  userVote = null,
  onVote,
  className = ''
}: VoteSystemProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(userVote)

  const handleVote = (direction: 'up' | 'down') => {
    // If clicking the same direction, remove the vote
    if (direction === currentVote) {
      setVotes(votes - (direction === 'up' ? 1 : -1))
      setCurrentVote(null)
    } 
    // If changing vote direction
    else if (currentVote) {
      setVotes(votes + (direction === 'up' ? 2 : -2))
      setCurrentVote(direction)
    }
    // If voting for the first time
    else {
      setVotes(votes + (direction === 'up' ? 1 : -1))
      setCurrentVote(direction)
    }

    onVote?.(direction)
  }

  return (
    <div className={`flex flex-col items-center h-full justify-between py-2 ${className}`}>
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('up')}
        className={`p-1 rounded-full transition-colors duration-200 ${
          currentVote === 'up'
            ? 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100'
            : 'text-slate-400 hover:text-cyan-600 hover:bg-cyan-50'
        }`}
      >
        {currentVote === 'up' ? (
          <ChevronUpSolid className="w-6 h-6" />
        ) : (
          <ChevronUpIcon className="w-6 h-6" />
        )}
      </button>

      {/* Vote Count */}
      <span className={`text-sm font-medium ${
        currentVote === 'up' 
          ? 'text-cyan-600'
          : currentVote === 'down'
          ? 'text-orange-600'
          : 'text-slate-600'
      }`}>
        {votes}
      </span>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('down')}
        className={`p-1 rounded-full transition-colors duration-200 ${
          currentVote === 'down'
            ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
            : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
        }`}
      >
        {currentVote === 'down' ? (
          <ChevronDownSolid className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  )
} 