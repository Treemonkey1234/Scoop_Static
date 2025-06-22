'use client'

import React from 'react'
import { getTrustLevel } from '@/lib/sampleData'

interface TrustBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
  className?: string
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  score, 
  size = 'md', 
  showScore = true,
  className = '' 
}) => {
  const trustLevel = getTrustLevel(score)
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const getIcon = () => {
    switch (trustLevel) {
      case 'excellent': return '🍦'
      case 'good': return '🍨'
      case 'fair': return '🧁'
      case 'poor': return '🍧'
      case 'new': return '🥛'
      default: return '🤔'
    }
  }

  const getLabel = () => {
    switch (trustLevel) {
      case 'excellent': return 'Legendary Lavender'
      case 'good': return 'Premium Pistachio'
      case 'fair': return 'Rocky Road Regular'
      case 'poor': return 'Melting Mint'
      case 'new': return 'Vanilla Newbie'
      default: return 'Unknown Flavor'
    }
  }

  return (
    <div className={`
      trust-badge trust-${trustLevel} ${sizeClasses[size]} ${className}
      animate-fade-in hover:scale-105 transition-all duration-200
    `}>
      <span className="mr-1">{getIcon()}</span>
      <span className="font-semibold">{getLabel()}</span>
      {showScore && (
        <span className="ml-1 opacity-75">({score})</span>
      )}
    </div>
  )
}

export default TrustBadge 