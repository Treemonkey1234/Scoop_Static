import React, { useState, useRef } from 'react'

interface DragVoteSystemProps {
  postId: string
  upvotes: number
  downvotes: number
  currentVote: 'up' | 'down' | null
  onVote: (postId: string, voteType: 'up' | 'down') => void
}

const DragVoteSystem: React.FC<DragVoteSystemProps> = ({
  postId,
  upvotes,
  downvotes,
  currentVote,
  onVote
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const coneRef = useRef<HTMLDivElement>(null)

  const totalVotes = upvotes + downvotes
  const adjustedUpvotes = upvotes + (currentVote === 'up' ? 1 : 0)
  const adjustedDownvotes = downvotes + (currentVote === 'down' ? 1 : 0)
  const adjustedTotal = adjustedUpvotes + adjustedDownvotes
  const positiveRatio = adjustedTotal > 0 ? (adjustedUpvotes / adjustedTotal) * 100 : 50

  // Create gradient based on vote ratio
  let gradientStyle = {}
  if (positiveRatio >= 80) {
    gradientStyle = { background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(148, 163, 184, 0.1) 100%)' }
  } else if (positiveRatio >= 60) {
    gradientStyle = { background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.2) 0%, rgba(148, 163, 184, 0.1) 50%, rgba(148, 163, 184, 0.1) 100%)' }
  } else if (positiveRatio >= 40) {
    gradientStyle = { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.1) 50%, rgba(148, 163, 184, 0.1) 100%)' }
  } else if (positiveRatio >= 20) {
    gradientStyle = { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.1) 50%, rgba(239, 68, 68, 0.2) 100%)' }
  } else {
    gradientStyle = { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(239, 68, 68, 0.3) 100%)' }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setStartPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setDragPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const newY = e.clientY - rect.top - startPosition.y
    
    // Constrain drag to container bounds
    const maxY = rect.height - 60 // cone height
    const constrainedY = Math.max(-10, Math.min(maxY, newY))
    
    setDragPosition({ x: 0, y: constrainedY })
  }

  const handleMouseUp = () => {
    if (!isDragging || !containerRef.current) return
    
    const containerHeight = containerRef.current.getBoundingClientRect().height
    const threshold = containerHeight * 0.3 // 30% threshold
    
    if (dragPosition.y < -threshold) {
      // Dragged up - upvote
      onVote(postId, 'up')
    } else if (dragPosition.y > threshold) {
      // Dragged down - downvote  
      onVote(postId, 'down')
    }
    
    setIsDragging(false)
    setDragPosition({ x: 0, y: 0 })
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setStartPosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top })
      setDragPosition({ x: 0, y: 0 })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const newY = touch.clientY - rect.top - startPosition.y
    
    // Constrain drag to container bounds
    const maxY = rect.height - 60 // cone height
    const constrainedY = Math.max(-10, Math.min(maxY, newY))
    
    setDragPosition({ x: 0, y: constrainedY })
  }

  const handleTouchEnd = () => {
    if (!isDragging || !containerRef.current) return
    
    const containerHeight = containerRef.current.getBoundingClientRect().height
    const threshold = containerHeight * 0.3 // 30% threshold
    
    if (dragPosition.y < -threshold) {
      // Dragged up - upvote
      onVote(postId, 'up')
    } else if (dragPosition.y > threshold) {
      // Dragged down - downvote  
      onVote(postId, 'down')
    }
    
    setIsDragging(false)
    setDragPosition({ x: 0, y: 0 })
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between h-full w-12 rounded-xl border border-slate-200 shadow-sm p-1 relative select-none"
      style={gradientStyle}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Upvote Zone Indicator */}
      <div className={`w-full h-6 rounded-t-lg flex items-center justify-center transition-all duration-200 ${
        !isDragging ? 'opacity-30' : ''
      }`}>
        <span className="text-xs text-green-600 opacity-50">↑</span>
      </div>

      {/* Draggable Ice Cream Cone */}
      <div
        ref={coneRef}
        className={`absolute cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isDragging ? 'scale-110 z-50' : 'z-20'
        } hover:scale-105`}
        style={{
          top: `50%`,
          left: '50%',
          transform: `translate(-50%, -50%) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg 
          width="36" 
          height="52" 
          viewBox="0 0 32 48" 
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-lg ${isDragging ? 'animate-pulse' : 'animate-bounce'}`}
          style={{ animationDuration: isDragging ? '0.5s' : '2s', animationIterationCount: isDragging ? 'infinite' : '3' }}
        >
          {/* Ice Cream Cone */}
          <defs>
            <linearGradient id={`coneGrad-${postId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E"/>
              <stop offset="100%" stopColor="#8B4513"/>
            </linearGradient>
            <linearGradient id={`scoopGrad-${postId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
          </defs>
          
          {/* Waffle Cone */}
          <path 
            d="M10 28 L16 44 L22 28 Z" 
            fill={`url(#coneGrad-${postId})`}
            stroke="#8B4513"
            strokeWidth="0.5"
          />
          
          {/* Waffle Pattern */}
          <g stroke="#654321" strokeWidth="0.3" opacity="0.7">
            <line x1="11" y1="30" x2="21" y2="30"/>
            <line x1="11.5" y1="32" x2="20.5" y2="32"/>
            <line x1="12" y1="34" x2="20" y2="34"/>
            <line x1="12.5" y1="36" x2="19.5" y2="36"/>
            <line x1="13" y1="38" x2="19" y2="38"/>
            <line x1="13.5" y1="40" x2="18.5" y2="40"/>
            
            <line x1="12" y1="29" x2="14" y2="38"/>
            <line x1="14" y1="29" x2="16" y2="38"/>
            <line x1="16" y1="29" x2="18" y2="38"/>
            <line x1="18" y1="29" x2="20" y2="38"/>
          </g>
          
          {/* Ice Cream Scoop */}
          <circle 
            cx="16" 
            cy="24" 
            r="8" 
            fill={`url(#scoopGrad-${postId})`}
            stroke="#FF1493"
            strokeWidth="0.3"
          />
          
          {/* Scoop Highlight */}
          <ellipse 
            cx="13" 
            cy="21" 
            rx="3" 
            ry="4" 
            fill="rgba(255,255,255,0.4)"
          />
          
          {/* Cherry on top */}
          <circle cx="16" cy="18" r="1.5" fill="#FF1744"/>
          <path d="M16 16 Q14 14 15 13" stroke="#4CAF50" strokeWidth="0.8" fill="none"/>
        </svg>
      </div>

      {/* Vote Score Display - positioned behind the ice cream */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 z-10 shadow-sm">
        <div className="text-xs font-bold text-slate-800 text-center">
          {adjustedUpvotes - adjustedDownvotes}
        </div>
        <div className="text-xs text-slate-600 text-center">
          {Math.round(positiveRatio)}%
        </div>
      </div>

      {/* Downvote Zone Indicator */}
      <div className={`w-full h-6 rounded-b-lg flex items-center justify-center transition-all duration-200 ${
        !isDragging ? 'opacity-30' : ''
      }`}>
        <span className="text-xs text-red-600 opacity-50">↓</span>
      </div>

      {/* Drag Instructions - Always visible when not dragging */}
      {!isDragging && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 pointer-events-none z-30">
          <div className="text-xs text-slate-500 text-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
            Drag 🍦
          </div>
        </div>
      )}
      
      {/* Enhanced Zone Indicators */}
      {isDragging && (
        <>
          <div className={`absolute top-0 left-0 right-0 h-1/3 rounded-t-xl transition-all duration-200 ${
            dragPosition.y < -20 ? 'bg-green-300/40 border-2 border-green-400' : 'bg-green-100/20'
          } flex items-center justify-center z-5`}>
            <span className="text-sm">👍 UPVOTE</span>
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 h-1/3 rounded-b-xl transition-all duration-200 ${
            dragPosition.y > 20 ? 'bg-red-300/40 border-2 border-red-400' : 'bg-red-100/20'
          } flex items-center justify-center z-5`}>
            <span className="text-sm">👎 DOWNVOTE</span>
          </div>
        </>
      )}
    </div>
  )
}

export default DragVoteSystem 