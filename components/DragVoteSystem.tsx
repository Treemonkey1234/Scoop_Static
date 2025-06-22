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
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastMoveTimeRef = useRef<number>(0)

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
      
      // Smooth constraint with easing at boundaries
      const maxRange = rect.height * 0.35 // 35% range for smoother feel
      const constrainedY = Math.max(-maxRange, Math.min(maxRange, newY))
      
      setDragPosition({ x: 0, y: constrainedY })
    })
  }, [startY])

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
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
    setIsDragging(true)
    
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

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!containerRef.current || e.touches.length !== 1) return

    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    setStartY(touch.clientY - rect.top)
    setDragPosition({ x: 0, y: 0 })
    setIsDragging(true)
    
    // Lock page scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${window.scrollY}px`
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    updatePosition(touch.clientY)
  }, [isDragging, updatePosition])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    finishDrag()
    
    // Unlock page scroll
    const scrollY = document.body.style.top
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.top = ''
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }, [])

  const finishDrag = useCallback(() => {
    if (!isDragging || !containerRef.current) return
    
    const containerHeight = containerRef.current.getBoundingClientRect().height
    const threshold = containerHeight * 0.15 // 15% threshold for better sensitivity
    
    if (dragPosition.y < -threshold) {
      onVote(postId, 'up')
    } else if (dragPosition.y > threshold) {
      onVote(postId, 'down')
    }
    
    setIsDragging(false)
    setDragPosition({ x: 0, y: 0 })
  }, [isDragging, dragPosition.y, postId, onVote])

  // Calculate drag intensity for visual feedback
  const containerHeight = containerRef.current?.getBoundingClientRect().height || 100
  const dragIntensity = Math.abs(dragPosition.y) / (containerHeight * 0.35)
  const isUpZone = dragPosition.y < -10
  const isDownZone = dragPosition.y > 10

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
        className={`absolute cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? 'scale-110 z-50' : 'z-20 duration-300'
        } hover:scale-105`}
        style={{
          top: '50%',
          left: '50%',
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
          className={`drop-shadow-lg ${isDragging ? 'animate-pulse' : ''}`}
          style={{ 
            filter: isDragging ? `brightness(${1 + dragIntensity * 0.3})` : 'brightness(1)',
            animationDuration: '0.6s'
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

      {/* Vote Score Display - only visible when dragging */}
      {isDragging && Math.abs(dragPosition.y) > 15 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 z-10 shadow-lg border border-slate-200 animate-in fade-in duration-200">
          <div className="text-sm font-bold text-slate-800 text-center">
            {adjustedUpvotes - adjustedDownvotes}
          </div>
          <div className="text-xs text-slate-600 text-center">
            {Math.round(positiveRatio)}%
          </div>
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
          <div className="text-xs text-slate-500 text-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm animate-pulse">
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