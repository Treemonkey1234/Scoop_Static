'use client'

import React from 'react'

interface Flavor {
  flavor: string
  score: number
}

interface PersonalityFlavorsProps {
  flavors: Flavor[]
  className?: string
}

const getFlavorEmoji = (flavor: string): string => {
  const emojiMap: Record<string, string> = {
    'helpful': '💡',
    'professional': '🏢',
    'creative': '🎨',
    'friendly': '😊',
    'funny': '😄',
    'smart': '🧠',
    'reliable': '🤝',
    'energetic': '⚡',
    'outgoing': '🎯',
    'calm': '🧘',
    'confident': '💪',
    'humble': '🙏',
    'tech-savvy': '💻',
    'organized': '📋',
    'leader': '👑',
    'team-player': '👥',
    'empathetic': '💚',
    'positive': '☀️',
    'motivating': '🚀',
    'honest': '💎'
  }
  return emojiMap[flavor] || '⭐'
}

const capitalizeFlavorName = (flavor: string): string => {
  // Handle hyphenated words
  return flavor.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export default function PersonalityFlavors({ flavors, className = '' }: PersonalityFlavorsProps) {
  if (!flavors || flavors.length === 0) {
    return null // Don't show anything if no flavors
  }

  // Take only top 4 flavors
  const topFlavors = flavors.slice(0, 4)

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
        🎭 Personality Flavors
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topFlavors.map((flavor, index) => (
          <div 
            key={index}
            className="flex items-center justify-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-sm transition-shadow"
          >
            <div className="text-sm font-medium text-slate-800 text-center leading-tight">
              {capitalizeFlavorName(flavor.flavor)}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        Based on what others say
      </p>
    </div>
  )
} 