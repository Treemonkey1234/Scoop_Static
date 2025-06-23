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
  // Core state
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isSticking, setIsSticking] = useState(false)
  const [showVoteCounter, setShowVoteCounter] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)
  const stickyTimeoutRef = useRef<NodeJS.Timeout>()

  const THRESHOLD = 25  // Pixels to trigger vote
  const STICKY_DURATION = 1500  // How long cone sticks in position

  // Calculate live vote preview
  const getVotePreview = () => {
    if (!isDragging || Math.abs(dragY) < THRESHOLD) {
      return { upvotes, downvotes, willVote: false, voteType: null }
    }
    
    const voteType: 'up' | 'down' = dragY < 0 ? 'up' : 'down'
    let newUpvotes = upvotes
    let newDownvotes = downvotes
    
    // Remove current vote if exists
    if (currentVote === 'up') newUpvotes--
    if (currentVote === 'down') newDownvotes--
    
    // Add new vote
    if (voteType === 'up') newUpvotes++
    else newDownvotes++
    
    return { 
      upvotes: newUpvotes, 
      downvotes: newDownvotes, 
      willVote: true, 
      voteType 
    }
  }

  // Clear any existing timeouts
  const clearTimeouts = () => {
    if (stickyTimeoutRef.current) {
      clearTimeout(stickyTimeoutRef.current)
      stickyTimeoutRef.current = undefined
    }
  }

  // Start dragging
  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    
    startPosRef.current = { x: clientX, y: clientY }
    hasMovedRef.current = false
    setIsDragging(true)
    setShowVoteCounter(true)
    setIsSticking(false)
    setFeedbackMessage('')
    clearTimeouts()
  }, [])

  // Update drag position  
  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || isSticking) return
    
    const deltaY = clientY - startPosRef.current.y
    const maxRange = 60 // Maximum drag distance
    const constrainedY = Math.max(-maxRange, Math.min(maxRange, deltaY))
    
    // Track if user has moved enough to count as intentional drag
    if (Math.abs(deltaY) > 5) {
      hasMovedRef.current = true
    }
    
    setDragY(constrainedY)
  }, [isDragging, isSticking])

  // End dragging with vote registration and sticking
  const endDrag = useCallback(() => {
    if (!isDragging) return
    
    const preview = getVotePreview()
    
    // Reset dragging state first
    setIsDragging(false)
    
    // Register vote if threshold met and user actually moved
    if (preview.willVote && hasMovedRef.current && preview.voteType) {
      onVote(postId, preview.voteType)
      
      // Show sticky behavior
      setIsSticking(true)
      const stickyPosition = preview.voteType === 'up' ? -40 : 40
      setDragY(stickyPosition)
      setFeedbackMessage(preview.voteType === 'up' ? 'Upvoted! 👍' : 'Downvoted! 👎')
      
      // Return to center after sticky duration
      clearTimeouts()
      stickyTimeoutRef.current = setTimeout(() => {
        setIsSticking(false)
        setDragY(0)
        setShowVoteCounter(false)
        setFeedbackMessage('')
      }, STICKY_DURATION)
    } else {
      // No vote - return to center immediately
      setDragY(0)
      setShowVoteCounter(false)
      setFeedbackMessage('')
    }
    
    hasMovedRef.current = false
  }, [isDragging, dragY, postId, onVote])

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      updateDrag(e.clientX, e.clientY)
    }
    
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      endDrag()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [startDrag, updateDrag, endDrag])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length !== 1) return
    
    const touch = e.touches[0]
    startDrag(touch.clientX, touch.clientY)
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        updateDrag(touch.clientX, touch.clientY)
      }
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      endDrag()
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }, [startDrag, updateDrag, endDrag])

  // Cleanup
  useEffect(() => {
    return () => clearTimeouts()
  }, [])

  const preview = getVotePreview()
  const isUpZone = dragY < -10
  const isDownZone = dragY > 10

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between h-full w-14 rounded-xl border border-slate-200 shadow-sm p-2 relative overflow-hidden select-none bg-slate-50"
      style={{
        background: isDragging && preview.willVote ? 
          (isUpZone ? 'linear-gradient(to bottom, rgba(34, 197, 94, 0.15), rgba(248, 250, 252, 1))' :
           'linear-gradient(to top, rgba(239, 68, 68, 0.15), rgba(248, 250, 252, 1))') : 
          undefined
      }}
    >
      {/* Upvote Zone Indicator */}
      <div className={`w-full h-8 rounded-t-lg flex items-center justify-center transition-all duration-200 ${
        isDragging && isUpZone ? 'bg-green-400/30' : 'opacity-40'
      }`}>
        <span className="text-sm text-green-600 font-bold">↑</span>
      </div>

      {/* Ice Cream Cone */}
      <div
        className={`absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none ${
          isDragging || isSticking ? 'z-50' : 'z-20'
        }`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isSticking ? 'transform 0.3s ease-out' : 
                     (!isDragging ? 'transform 0.5s ease-out' : 'none'),
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <svg 
          width="40" 
          height="56" 
          viewBox="0 0 40 56" 
          className={`transition-all duration-200 ${
            isDragging || isSticking ? 'scale-110 drop-shadow-lg' : 'drop-shadow-md'
          } ${
            preview.willVote && isDragging ? 'brightness-110' : ''
          }`}
        >
          <defs>
            <linearGradient id={`cone-${postId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DEB887"/>
              <stop offset="100%" stopColor="#8B7355"/>
            </linearGradient>
            <linearGradient id={`scoop-${postId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE4E1"/>
              <stop offset="50%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
          </defs>
          
          {/* Cone */}
          <path 
            d="M12 32 L20 52 L28 32 Z" 
            fill={`url(#cone-${postId})`}
            stroke="#8B7355"
            strokeWidth="1"
          />
          
          {/* Crosshatch pattern on cone */}
          <path d="M14 35 L26 35 M15 38 L25 38 M16 41 L24 41 M17 44 L23 44 M18 47 L22 47" 
                stroke="#8B7355" strokeWidth="0.5" />
          
          {/* Ice cream scoop */}
          <circle 
            cx="20" 
            cy="28" 
            r="10" 
            fill={`url(#scoop-${postId})`}
            stroke="#FF1493"
            strokeWidth="0.5"
          />
          
          {/* Highlight on scoop */}
          <ellipse 
            cx="16" 
            cy="24" 
            rx="3" 
            ry="4" 
            fill="rgba(255,255,255,0.6)"
          />
          
          {/* Cherry on top */}
          <circle cx="20" cy="20" r="2" fill="#DC143C"/>
          <ellipse cx="19" cy="19" rx="0.8" ry="1" fill="rgba(255,255,255,0.4)"/>
        </svg>
      </div>

      {/* Live Vote Counter */}
      {(showVoteCounter || feedbackMessage) && (
        <div className="absolute top-1/2 left-16 transform -translate-y-1/2 z-40 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-left duration-200">
          <div className="text-sm font-semibold text-slate-700 space-y-1 min-w-[50px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-green-600">👍</span>
              <span className="font-mono tabular-nums">{preview.upvotes}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-red-600">👎</span>
              <span className="font-mono tabular-nums">{preview.downvotes}</span>
            </div>
            {feedbackMessage && (
              <div className="text-xs text-center text-slate-600 mt-1 pt-1 border-t border-slate-200">
                {feedbackMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vote Preview Indicator */}
      {isDragging && preview.willVote && !feedbackMessage && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 px-3 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-sm border-2 ${
          preview.voteType === 'up' ? 
            'bg-green-100/90 text-green-800 border-green-300' :
            'bg-red-100/90 text-red-800 border-red-300'
        }`}>
          {preview.voteType === 'up' ? '+1 👍' : '+1 👎'}
        </div>
      )}

      {/* Downvote Zone Indicator */}
      <div className={`w-full h-8 rounded-b-lg flex items-center justify-center transition-all duration-200 ${
        isDragging && isDownZone ? 'bg-red-400/30' : 'opacity-40'
      }`}>
        <span className="text-sm text-red-600 font-bold">↓</span>
      </div>

      {/* Instructions */}
      {!isDragging && !showVoteCounter && !isSticking && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none z-30">
          <div className="text-xs text-slate-500 bg-white/90 px-2 py-1 rounded-md shadow-sm border border-slate-200">
            Drag 🍦
          </div>
        </div>
      )}
    </div>
  )
}

export default DragVoteSystem 