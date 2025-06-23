import React, { useState, useEffect } from 'react'

interface ClassicVoteSystemProps {
  postId: string
  upvotes: number
  downvotes: number
  currentVote: 'up' | 'down' | null
  onVote: (postId: string, voteType: 'up' | 'down') => void
}

const ClassicVoteSystem: React.FC<ClassicVoteSystemProps> = ({
  postId,
  upvotes,
  downvotes,
  currentVote,
  onVote
}) => {
  // Animation states
  const [isUpvoteAnimating, setIsUpvoteAnimating] = useState(false)
  const [isDownvoteAnimating, setIsDownvoteAnimating] = useState(false)
  
  // Calculate vote percentage for gradient
  const totalVotes = upvotes + downvotes
  const upvotePercentage = totalVotes === 0 ? 50 : (upvotes / totalVotes) * 100
  
  // Handle voting with animation
  const handleVote = (voteType: 'up' | 'down') => {
    if (voteType === 'up') {
      setIsUpvoteAnimating(true)
      setTimeout(() => setIsUpvoteAnimating(false), 500)
    } else {
      setIsDownvoteAnimating(true)
      setTimeout(() => setIsDownvoteAnimating(false), 500)
    }
    onVote(postId, voteType)
  }

  return (
    <div className="flex flex-col items-center w-14 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden select-none">
      {/* Dynamic gradient background based on vote distribution */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(34, 197, 94, ${upvotePercentage / 100 * 0.2}),
            rgba(248, 250, 252, 1) ${upvotePercentage}%,
            rgba(239, 68, 68, ${(100 - upvotePercentage) / 100 * 0.2}) 100%)`
        }}
      />

      {/* Upvote Section */}
      <button
        onClick={() => handleVote('up')}
        className={`relative flex flex-col items-center justify-center w-full p-3 transition-all duration-200 hover:bg-green-50 ${
          currentVote === 'up' ? 'text-green-600' : 'text-slate-600'
        } ${isUpvoteAnimating ? 'scale-110' : ''}`}
      >
        <span className={`text-lg transform transition-transform ${
          isUpvoteAnimating ? 'scale-125' : ''
        }`}>▲</span>
        <span className={`text-xs font-semibold mt-1 ${
          currentVote === 'up' ? 'text-green-600' : 'text-slate-600'
        }`}>+1</span>
        <span className={`text-sm font-mono mt-1 ${
          currentVote === 'up' ? 'text-green-600 font-bold' : 'text-slate-500'
        }`}>{upvotes}</span>
      </button>

      {/* Vote Percentage */}
      <div className="relative w-full py-2 text-center border-y border-slate-100">
        <span className="text-sm font-medium text-slate-500">
          {Math.round(upvotePercentage)}%
        </span>
      </div>

      {/* Downvote Section */}
      <button
        onClick={() => handleVote('down')}
        className={`relative flex flex-col items-center justify-center w-full p-3 transition-all duration-200 hover:bg-red-50 ${
          currentVote === 'down' ? 'text-red-600' : 'text-slate-600'
        } ${isDownvoteAnimating ? 'scale-110' : ''}`}
      >
        <span className={`text-lg transform transition-transform ${
          isDownvoteAnimating ? 'scale-125' : ''
        }`}>▼</span>
        <span className={`text-xs font-semibold mt-1 ${
          currentVote === 'down' ? 'text-red-600' : 'text-slate-600'
        }`}>-1</span>
        <span className={`text-sm font-mono mt-1 ${
          currentVote === 'down' ? 'text-red-600 font-bold' : 'text-slate-500'
        }`}>{downvotes}</span>
      </button>
    </div>
  )
}

export default ClassicVoteSystem 