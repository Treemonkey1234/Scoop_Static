'use client'

import React from 'react'

interface TrustBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ score, size = 'md', showLabel = false }) => {
  const getTrustLevel = (score: number) => {
    if (score >= 90) return 'excellent'
    if (score >= 80) return 'verygood'
    if (score >= 70) return 'good'
    if (score >= 60) return 'fair'
    return 'poor'
  }

  const getTrustColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-trust-excellent text-white'
      case 'verygood': return 'bg-trust-verygood text-white'
      case 'good': return 'bg-trust-good text-white'
      case 'fair': return 'bg-trust-fair text-slate-800'
      case 'poor': return 'bg-trust-poor text-slate-800'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getTrustLabel = (level: string) => {
    switch (level) {
      case 'excellent': return 'Excellent'
      case 'verygood': return 'Very Good'
      case 'good': return 'Good'
      case 'fair': return 'Fair'
      case 'poor': return 'Poor'
      default: return 'Unknown'
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1'
      case 'lg': return 'text-lg px-4 py-2'
      default: return 'text-sm px-3 py-1'
    }
  }

  const level = getTrustLevel(score)
  const colorClass = getTrustColor(level)
  const sizeClass = getSizeClasses(size)

  return (
    <div className={`${colorClass} ${sizeClass} rounded-full font-bold inline-flex items-center justify-center min-w-0 whitespace-nowrap shadow-sm`}>
      {score}
      {showLabel && size !== 'sm' && (
        <span className="ml-1 font-medium text-xs">
          {getTrustLabel(level)}
        </span>
      )}
    </div>
  )
}

export default TrustBadge 