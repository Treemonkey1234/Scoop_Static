import React, { useState, useRef, useCallback, useEffect } from 'react'

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
  // Simplified state - only what we actually need
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'up' | 'down' | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const feedbackTimeoutRef = useRef<NodeJS.Timeout>()

  // Calculate display values
  const totalVotes = upvotes + downvotes
  const displayUpvotes = upvotes + (currentVote === 'up' ? 1 : 0)
  const displayDownvotes = downvotes + (currentVote === 'down' ? 1 : 0)
  const displayTotal = displayUpvotes + displayDownvotes
  const positiveRatio = displayTotal > 0 ? (displayUpvotes / displayTotal) * 100 : 50

  // Simple gradient based on ratio
  const getContainerStyle = () => {
    if (positiveRatio >= 70) {
      return { background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.3), rgba(148, 163, 184, 0.1))' }
    } else if (positiveRatio <= 30) {
      return { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1), rgba(239, 68, 68, 0.3))' }
    } else {
      return { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1), rgba(148, 163, 184, 0.1))' }
    }
  }

  // Clean up any pending timeouts
  const clearFeedbackTimeout = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = undefined
    }
  }

  // Start drag operation
  const startDrag = useCallback((clientY: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    startYRef.current = clientY - rect.top - rect.height / 2
    hasDraggedRef.current = false
    setIsDragging(true)
    setDragY(0)
    clearFeedbackTimeout()
  }, [])

  // Update drag position
  const updateDrag = useCallback((clientY: number) => {
    if (!isDragging || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const newY = clientY - rect.top - rect.height / 2 - startYRef.current
    
    // Constrain to reasonable range
    const maxRange = rect.height * 0.3
    const constrainedY = Math.max(-maxRange, Math.min(maxRange, newY))
    
    // Track if user has actually dragged
    if (Math.abs(constrainedY) > 10) {
      hasDraggedRef.current = true
    }
    
    setDragY(constrainedY)
  }, [isDragging])

  // End drag operation
  const endDrag = useCallback(() => {
    if (!isDragging || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const threshold = rect.height * 0.15
    
    // Determine if vote should be registered
    let voteType: 'up' | 'down' | null = null
    if (Math.abs(dragY) > threshold) {
      voteType = dragY < 0 ? 'up' : 'down'
    }
    
    // Always reset drag state immediately
    setIsDragging(false)
    setDragY(0)
    
    // Register vote and show feedback if applicable
    if (voteType && hasDraggedRef.current) {
      onVote(postId, voteType)
      setFeedbackType(voteType)
      setShowFeedback(true)
      
      // Clear feedback after a short time
      clearFeedbackTimeout()
      feedbackTimeoutRef.current = setTimeout(() => {
        setShowFeedback(false)
        setFeedbackType(null)
      }, 800)
    }
    
    hasDraggedRef.current = false
  }, [isDragging, dragY, postId, onVote])

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startDrag(e.clientY)
    
    const handleMouseMove = (e: MouseEvent) => updateDrag(e.clientY)
    const handleMouseUp = () => {
      endDrag()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [startDrag, updateDrag, endDrag])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length !== 1) return
    
    startDrag(e.touches[0].clientY)
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        updateDrag(e.touches[0].clientY)
      }
    }
    const handleTouchEnd = () => {
      endDrag()
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }, [startDrag, updateDrag, endDrag])

  // Simple click handler for quick votes (when not dragging)
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only handle click if we haven't dragged
    if (!hasDraggedRef.current && !isDragging) {
      e.preventDefault()
      onVote(postId, 'up') // Default to upvote on click
      
      setFeedbackType('up')
      setShowFeedback(true)
      
      clearFeedbackTimeout()
      feedbackTimeoutRef.current = setTimeout(() => {
        setShowFeedback(false)
        setFeedbackType(null)
      }, 600)
    }
  }, [isDragging, postId, onVote])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFeedbackTimeout()
    }
  }, [])

  // Determine current zone
  const threshold = containerRef.current ? containerRef.current.getBoundingClientRect().height * 0.15 : 20
  const isUpZone = dragY < -10
  const isDownZone = dragY > 10
  const willVote = Math.abs(dragY) > threshold

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between h-full w-12 rounded-xl border border-slate-200 shadow-sm p-1 relative overflow-hidden select-none"
      style={getContainerStyle()}
    >
      {/* Top zone indicator */}
      <div className={`w-full h-6 rounded-t-lg flex items-center justify-center transition-all duration-200 ${
        isDragging && isUpZone ? 'bg-green-400/40' : 'opacity-30'
      }`}>
        <span className="text-xs text-green-600 font-bold">↑</span>
      </div>

      {/* Ice cream cone */}
      <div
        className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out hover:scale-105 ${
          isDragging ? 'scale-110 z-50' : 'z-20'
        } flex items-center justify-center select-none touch-none`}
        style={{
          top: '50%',
          left: '50%',
          width: '48px',
          height: '64px',
          transform: `translate(-50%, -50%) translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        <svg 
          width="32" 
          height="48" 
          viewBox="0 0 32 48" 
          className={`transition-all duration-200 ${
            showFeedback ? 'drop-shadow-lg' : 'drop-shadow-md'
          } ${
            feedbackType === 'up' ? 'brightness-110 scale-110' :
            feedbackType === 'down' ? 'brightness-90 scale-105' :
            isDragging && willVote ? 'brightness-110' : ''
          }`}
        >
          <defs>
            <linearGradient id={`cone-${postId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E"/>
              <stop offset="100%" stopColor="#8B4513"/>
            </linearGradient>
            <linearGradient id={`scoop-${postId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
          </defs>
          
          {/* Cone */}
          <path 
            d="M10 28 L16 44 L22 28 Z" 
            fill={`url(#cone-${postId})`}
            stroke="#8B4513"
            strokeWidth="0.5"
          />
          
          {/* Ice cream scoop */}
          <circle 
            cx="16" 
            cy="24" 
            r="8" 
            fill={`url(#scoop-${postId})`}
            stroke="#FF1493"
            strokeWidth="0.3"
          />
          
          {/* Highlight */}
          <ellipse 
            cx="13" 
            cy="21" 
            rx="2.5" 
            ry="3" 
            fill="rgba(255,255,255,0.5)"
          />
          
          {/* Cherry */}
          <circle cx="16" cy="18" r="1.5" fill="#FF1744"/>
        </svg>
      </div>

      {/* Vote preview during drag */}
      {isDragging && willVote && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 px-3 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-sm ${
          isUpZone ? 'bg-green-100/90 text-green-700 border border-green-300' :
          'bg-red-100/90 text-red-700 border border-red-300'
        }`}>
          {isUpZone ? '+1 👍' : '+1 👎'}
        </div>
      )}

      {/* Feedback display */}
      {showFeedback && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 px-3 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-sm animate-in fade-in duration-200 ${
          feedbackType === 'up' ? 'bg-green-100/90 text-green-700 border border-green-300' :
          'bg-red-100/90 text-red-700 border border-red-300'
        }`}>
          {feedbackType === 'up' ? 'Upvoted! 👍' : 'Downvoted! 👎'}
        </div>
      )}

      {/* Bottom zone indicator */}
      <div className={`w-full h-6 rounded-b-lg flex items-center justify-center transition-all duration-200 ${
        isDragging && isDownZone ? 'bg-red-400/40' : 'opacity-30'
      }`}>
        <span className="text-xs text-red-600 font-bold">↓</span>
      </div>

      {/* Instructions */}
      {!isDragging && !showFeedback && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 pointer-events-none z-30">
          <div className="text-xs text-slate-500 bg-white/80 px-2 py-1 rounded shadow-sm">
            Drag 🍦
          </div>
        </div>
      )}
    </div>
  )
}

export default DragVoteSystem 