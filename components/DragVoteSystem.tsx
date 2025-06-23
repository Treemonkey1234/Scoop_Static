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
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [startY, setStartY] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)
  const [visualVoteState, setVisualVoteState] = useState<'up' | 'down' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastMoveTimeRef = useRef<number>(0)
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalVotes = upvotes + downvotes
  const adjustedUpvotes = upvotes + (currentVote === 'up' ? 1 : 0)
  const adjustedDownvotes = downvotes + (currentVote === 'down' ? 1 : 0)
  const adjustedTotal = adjustedUpvotes + adjustedDownvotes
  const positiveRatio = adjustedTotal > 0 ? (adjustedUpvotes / adjustedTotal) * 100 : 50

  // Create gradient based on vote ratio
  const getGradientStyle = useCallback(() => {
    if (positiveRatio >= 80) {
      return { background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(148, 163, 184, 0.1) 100%)' }
    } else if (positiveRatio >= 60) {
      return { background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.2) 0%, rgba(148, 163, 184, 0.1) 50%, rgba(148, 163, 184, 0.1) 100%)' }
    } else if (positiveRatio >= 40) {
      return { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.1) 50%, rgba(148, 163, 184, 0.1) 100%)' }
    } else if (positiveRatio >= 20) {
      return { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.1) 50%, rgba(239, 68, 68, 0.2) 100%)' }
    } else {
      return { background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(239, 68, 68, 0.3) 100%)' }
    }
  }, [positiveRatio])

  // Optimized position update with requestAnimationFrame
  const updatePosition = useCallback((clientY: number) => {
    if (!containerRef.current) return

    const now = Date.now()
    if (now - lastMoveTimeRef.current < 16) return // Throttle to ~60fps
    lastMoveTimeRef.current = now

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const newY = clientY - rect.top - startY
      
      // Constrain to smaller range to avoid home button area
      const maxRange = rect.height * 0.25 // Reduced from 35% to 25% to avoid mobile UI
      const constrainedY = Math.max(-maxRange, Math.min(maxRange, newY))
      
      // Mark as moved if dragged more than 5px
      if (Math.abs(constrainedY) > 5) {
        setHasMoved(true)
      }
      
      setDragPosition({ x: 0, y: constrainedY })
    })
  }, [startY])

  // Clean up animation frame and timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setStartY(e.clientY - rect.top)
    setDragPosition({ x: 0, y: 0 })
    setHasMoved(false)
    setIsDragging(true)
    setVisualVoteState(null) // Reset vote state when starting new drag
    
    // Clear any pending reset timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
    
    // Add global mouse events
    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault()
    updatePosition(e.clientY)
  }, [updatePosition])

  const handleGlobalMouseUp = useCallback(() => {
    finishDrag()
    document.removeEventListener('mousemove', handleGlobalMouseMove)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  // Touch events - back to simpler approach
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!containerRef.current || e.touches.length !== 1) return

    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    setStartY(touch.clientY - rect.top)
    setDragPosition({ x: 0, y: 0 })
    setHasMoved(false)
    setIsDragging(true)
    setVisualVoteState(null) // Reset vote state when starting new drag
    
    // Clear any pending reset timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const touch = e.touches[0]
    updatePosition(touch.clientY)
  }, [isDragging, updatePosition])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    
    e.preventDefault()
    e.stopPropagation()
    finishDrag()
  }, [isDragging])

  const finishDrag = useCallback(() => {
    if (!isDragging || !containerRef.current) return
    
    let finalPosition = { x: 0, y: 0 }
    
    // Only vote if user actually dragged (not just tapped)
    if (hasMoved) {
      const containerHeight = containerRef.current.getBoundingClientRect().height
      const threshold = containerHeight * 0.12 // 12% threshold to work with 25% max range
      const maxRange = containerHeight * 0.25 // Maximum range for positioning
      
      if (dragPosition.y < -threshold) {
        onVote(postId, 'up')
        // Stick to upvote position
        finalPosition = { x: 0, y: -maxRange * 0.8 }
        setVisualVoteState('up')
        
        // Auto-reset to center after 1.2 seconds to show the vote was registered
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
        }
        resetTimeoutRef.current = setTimeout(() => {
          setDragPosition({ x: 0, y: 0 })
          setVisualVoteState(null)
          resetTimeoutRef.current = null
        }, 1200)
      } else if (dragPosition.y > threshold) {
        onVote(postId, 'down')
        // Stick to downvote position
        finalPosition = { x: 0, y: maxRange * 0.8 }
        setVisualVoteState('down')
        
        // Auto-reset to center after 1.2 seconds to show the vote was registered
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
        }
        resetTimeoutRef.current = setTimeout(() => {
          setDragPosition({ x: 0, y: 0 })
          setVisualVoteState(null)
          resetTimeoutRef.current = null
        }, 1200)
      } else {
        // Reset visual state if no vote threshold reached
        setVisualVoteState(null)
      }
      // If no vote threshold reached, return to center (default finalPosition)
    }
    
    setIsDragging(false)
    setDragPosition(finalPosition)
    setHasMoved(false)
  }, [isDragging, hasMoved, dragPosition.y, postId, onVote])

  // Calculate drag intensity for visual feedback
  const containerHeight = containerRef.current?.getBoundingClientRect().height || 100
  const dragIntensity = Math.abs(dragPosition.y) / (containerHeight * 0.25)
  const isUpZone = dragPosition.y < -8
  const isDownZone = dragPosition.y > 8

  // Calculate preview vote state based on drag position
  const getPreviewVoteState = () => {
    if (!isDragging || Math.abs(dragPosition.y) <= 15) {
      return { upvotes: adjustedUpvotes, downvotes: adjustedDownvotes, ratio: positiveRatio }
    }
    
    const threshold = containerHeight * 0.12
    if (dragPosition.y < -threshold) {
      // Preview upvote
      const previewUpvotes = currentVote === 'up' ? upvotes : upvotes + 1
      const previewDownvotes = currentVote === 'down' ? downvotes - 1 : downvotes
      const previewTotal = previewUpvotes + previewDownvotes
      const previewRatio = previewTotal > 0 ? (previewUpvotes / previewTotal) * 100 : 50
      return { upvotes: previewUpvotes, downvotes: previewDownvotes, ratio: previewRatio }
    } else if (dragPosition.y > threshold) {
      // Preview downvote
      const previewUpvotes = currentVote === 'up' ? upvotes - 1 : upvotes
      const previewDownvotes = currentVote === 'down' ? downvotes : downvotes + 1
      const previewTotal = previewUpvotes + previewDownvotes
      const previewRatio = previewTotal > 0 ? (previewUpvotes / previewTotal) * 100 : 50
      return { upvotes: previewUpvotes, downvotes: previewDownvotes, ratio: previewRatio }
    }
    
    return { upvotes: adjustedUpvotes, downvotes: adjustedDownvotes, ratio: positiveRatio }
  }

  const previewState = getPreviewVoteState()

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between h-full w-12 rounded-xl border border-slate-200 shadow-sm p-1 relative select-none overflow-hidden"
      style={getGradientStyle()}
    >
      {/* Upvote Zone Indicator */}
      <div className={`w-full h-6 rounded-t-lg flex items-center justify-center transition-all duration-150 ${
        isDragging && isUpZone ? 'bg-green-400/30 scale-105' : 'opacity-40'
      }`}>
        <span className="text-xs text-green-600">↑</span>
      </div>

      {/* Draggable Ice Cream Cone */}
      <div
        data-ice-cream="true"
        className={`absolute cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? 'scale-110 z-50' : 'z-20 duration-300'
        } hover:scale-105 touch-none flex items-center justify-center`}
        style={{
          top: '50%',
          left: '50%',
          width: '56px', // Larger touch area (36px + 20px padding)
          height: '72px', // Larger touch area (52px + 20px padding)
          transform: `translate(-50%, -50%) translateY(${dragPosition.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          className="drop-shadow-lg transition-all duration-300"
          style={{ 
            filter: isDragging ? `brightness(${1 + dragIntensity * 0.3})` : 
                   visualVoteState === 'up' ? 'brightness(1.2) saturate(1.2)' :
                   visualVoteState === 'down' ? 'brightness(0.9) saturate(1.2)' : 'brightness(1)',
            transform: visualVoteState === 'up' ? 'scale(1.1)' : 
                      visualVoteState === 'down' ? 'scale(1.05)' : 'scale(1)'
          }}
        >
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

      {/* Vote Score Display - visible when dragging and shows preview */}
      {isDragging && Math.abs(dragPosition.y) > 8 && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 z-10 shadow-lg border-2 opacity-100 transition-all duration-200 ${
          isUpZone ? 'border-green-400 bg-green-50/95' : 
          isDownZone ? 'border-red-400 bg-red-50/95' : 
          'border-slate-200'
        }`}>
          <div className={`text-sm font-bold text-center transition-colors duration-200 ${
            isUpZone ? 'text-green-700' : 
            isDownZone ? 'text-red-700' : 
            'text-slate-800'
          }`}>
            {previewState.upvotes - previewState.downvotes}
          </div>
          <div className={`text-xs text-center transition-colors duration-200 ${
            isUpZone ? 'text-green-600' : 
            isDownZone ? 'text-red-600' : 
            'text-slate-600'
          }`}>
            {Math.round(previewState.ratio)}%
          </div>
          {Math.abs(dragPosition.y) > containerHeight * 0.12 && (
            <div className={`text-xs font-medium text-center mt-1 transition-colors duration-200 ${
              isUpZone ? 'text-green-600' : 'text-red-600'
            }`}>
              {isUpZone ? '+1 👍' : '+1 👎'}
            </div>
          )}
        </div>
      )}

      {/* Downvote Zone Indicator */}
      <div className={`w-full h-6 rounded-b-lg flex items-center justify-center transition-all duration-150 ${
        isDragging && isDownZone ? 'bg-red-400/30 scale-105' : 'opacity-40'
      }`}>
        <span className="text-xs text-red-600">↓</span>
      </div>

      {/* Drag Instructions */}
      {!isDragging && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 pointer-events-none z-30">
          <div className="text-xs text-slate-500 text-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
            Drag 🍦
          </div>
        </div>
      )}
      
      {/* Dynamic Zone Feedback */}
      {isDragging && (
        <>
          <div className={`absolute top-0 left-0 right-0 h-2/5 rounded-t-xl transition-all duration-200 flex items-center justify-center z-5 ${
            isUpZone ? 'bg-green-300/50 border-2 border-green-400 shadow-lg' : 'bg-green-100/20'
          }`}>
            {isUpZone && <span className="text-sm font-semibold text-green-700">👍 UPVOTE</span>}
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 h-2/5 rounded-b-xl transition-all duration-200 flex items-center justify-center z-5 ${
            isDownZone ? 'bg-red-300/50 border-2 border-red-400 shadow-lg' : 'bg-red-100/20'
          }`}>
            {isDownZone && <span className="text-sm font-semibold text-red-700">👎 DOWNVOTE</span>}
          </div>
        </>
      )}
    </div>
  )
}

export default DragVoteSystem 