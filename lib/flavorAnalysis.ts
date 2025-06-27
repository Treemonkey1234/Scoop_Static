/**
 * ScoopSocials Flavor Analysis System
 * Real-time sentiment + keyword analysis for personality trait extraction
 * 
 * Analyzes what users write about each other to generate "flavors" 
 * (personality traits) that appear on user profiles
 * 
 * @version 1.0.0
 * @author ScoopSocials Platform Team
 */

const Sentiment = require('sentiment')
const sentiment = new Sentiment()

export interface FlavorAnalysis {
  flavors: Record<string, number>  // flavor -> confidence score (0-1)
  sentiment: number                // overall sentiment (-1 to 1)
  confidence: number               // overall confidence in analysis
  lastUpdated: string
}

export interface UserFlavorProfile {
  userId: string
  topFlavors: Array<{
    flavor: string
    score: number
    frequency: number             // how many times mentioned
  }>
  allFlavors: Record<string, number>
  totalComments: number
  lastUpdated: string
}

// Predefined flavor categories with associated keywords
const FLAVOR_KEYWORDS = {
  // Personality Traits
  'helpful': ['helpful', 'helping', 'supportive', 'assists', 'assistance', 'aids', 'caring'],
  'professional': ['professional', 'business-like', 'formal', 'corporate', 'work-oriented', 'serious'],
  'creative': ['creative', 'artistic', 'innovative', 'original', 'imaginative', 'inventive'],
  'friendly': ['friendly', 'nice', 'kind', 'warm', 'welcoming', 'approachable', 'pleasant'],
  'funny': ['funny', 'hilarious', 'humorous', 'witty', 'comedy', 'jokes', 'entertaining'],
  'smart': ['smart', 'intelligent', 'clever', 'bright', 'brilliant', 'genius', 'wise'],
  'reliable': ['reliable', 'dependable', 'trustworthy', 'consistent', 'steady', 'responsible'],
  'energetic': ['energetic', 'active', 'dynamic', 'enthusiastic', 'lively', 'vibrant'],
  
  // Social Traits
  'outgoing': ['outgoing', 'social', 'extroverted', 'talkative', 'engaging', 'interactive'],
  'calm': ['calm', 'peaceful', 'relaxed', 'chill', 'zen', 'tranquil', 'serene'],
  'confident': ['confident', 'self-assured', 'bold', 'assertive', 'strong', 'decisive'],
  'humble': ['humble', 'modest', 'down-to-earth', 'unpretentious', 'grounded'],
  
  // Skill-Based
  'tech-savvy': ['tech-savvy', 'technical', 'techy', 'digital', 'computer', 'coding', 'programming'],
  'organized': ['organized', 'structured', 'planned', 'systematic', 'orderly'],
  'leader': ['leader', 'leadership', 'takes-charge', 'guides', 'manages', 'directs'],
  'team-player': ['team-player', 'collaborative', 'cooperative', 'works-well-with-others'],
  
  // Emotional Intelligence
  'empathetic': ['empathetic', 'understanding', 'compassionate', 'sensitive', 'caring'],
  'positive': ['positive', 'optimistic', 'upbeat', 'cheerful', 'happy', 'joyful'],
  'motivating': ['motivating', 'inspiring', 'encouraging', 'uplifting', 'supportive'],
  'honest': ['honest', 'truthful', 'genuine', 'authentic', 'real', 'sincere']
}

class FlavorAnalysisEngine {
  private userProfiles: Map<string, UserFlavorProfile> = new Map()
  
  constructor() {
    this.loadExistingProfiles()
  }

  /**
   * Analyze a comment about a user and update their flavor profile
   * @param targetUserId - The user being commented about
   * @param comment - The comment text
   * @param commenterUserId - Who wrote the comment (optional)
   */
  analyzeComment(targetUserId: string, comment: string, commenterUserId?: string): FlavorAnalysis {
    const analysis = this.performFlavorAnalysis(comment)
    this.updateUserProfile(targetUserId, analysis, comment)
    
    // Track analytics
    this.trackFlavorUpdate(targetUserId, analysis, commenterUserId)
    
    return analysis
  }

  /**
   * Get a user's current flavor profile
   * @param userId - User to get flavors for
   * @returns User's flavor profile with top 4 flavors
   */
  getUserFlavors(userId: string): UserFlavorProfile | null {
    return this.userProfiles.get(userId) || null
  }

  /**
   * Get top 4 flavors for display on user profile
   * @param userId - User to get flavors for
   */
  getTopFlavors(userId: string): Array<{flavor: string, score: number}> {
    const profile = this.userProfiles.get(userId)
    if (!profile) return []
    
    return profile.topFlavors.slice(0, 4).map(f => ({
      flavor: f.flavor,
      score: Math.round(f.score * 100) // Convert to percentage
    }))
  }

  /**
   * Analyze multiple comments at once (for batch processing)
   * @param targetUserId - User being commented about
   * @param comments - Array of comment texts
   */
  batchAnalyzeComments(targetUserId: string, comments: string[]): FlavorAnalysis {
    const combinedText = comments.join(' ')
    return this.analyzeComment(targetUserId, combinedText)
  }

  /**
   * Get flavor-based audience segments for commercial use
   */
  getCommercialSegments(): Record<string, Array<{userId: string, score: number}>> {
    const segments: Record<string, Array<{userId: string, score: number}>> = {}
    
    // Group users by their dominant flavors
    this.userProfiles.forEach((profile, userId) => {
      profile.topFlavors.forEach(flavor => {
        if (!segments[flavor.flavor]) segments[flavor.flavor] = []
        segments[flavor.flavor].push({
          userId,
          score: flavor.score
        })
      })
    })
    
    // Sort each segment by score
    Object.keys(segments).forEach(flavor => {
      segments[flavor].sort((a, b) => b.score - a.score)
    })
    
    return segments
  }

  // Private methods
  private performFlavorAnalysis(text: string): FlavorAnalysis {
    const sentimentResult = sentiment.analyze(text)
    const flavors: Record<string, number> = {}
    const words = text.toLowerCase().split(/\W+/)
    
    // Extract flavors using keyword matching
    Object.entries(FLAVOR_KEYWORDS).forEach(([flavor, keywords]) => {
      let score = 0
      let matches = 0
      
      keywords.forEach(keyword => {
        // Check for exact word matches
        if (words.includes(keyword)) {
          matches++
          score += 1
        }
        
        // Check for partial matches in original text
        if (text.toLowerCase().includes(keyword)) {
          score += 0.5
        }
      })
      
      if (score > 0) {
        // Normalize score and adjust for sentiment
        let normalizedScore = Math.min(score / keywords.length, 1)
        
        // Boost positive flavors if sentiment is positive
        if (sentimentResult.score > 0) {
          normalizedScore = Math.min(normalizedScore * 1.2, 1)
        }
        
        flavors[flavor] = normalizedScore
      }
    })

    // Calculate overall confidence based on text length and matches
    const confidence = Math.min(
      (Object.keys(flavors).length * 0.2) + (text.length / 100 * 0.3) + 0.5,
      1
    )

    return {
      flavors,
      sentiment: sentimentResult.score / Math.max(Math.abs(sentimentResult.score), 1), // Normalize to -1 to 1
      confidence,
      lastUpdated: new Date().toISOString()
    }
  }

  private updateUserProfile(userId: string, analysis: FlavorAnalysis, commentText: string): void {
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      profile = {
        userId,
        topFlavors: [],
        allFlavors: {},
        totalComments: 0,
        lastUpdated: new Date().toISOString()
      }
    }

    // Update flavor scores using weighted average
    Object.entries(analysis.flavors).forEach(([flavor, score]) => {
      const currentScore = profile!.allFlavors[flavor] || 0
      const currentCount = profile!.totalComments
      
      // Weighted average: give more weight to recent comments
      const newScore = currentCount === 0 
        ? score 
        : (currentScore * currentCount + score * 1.5) / (currentCount + 1.5)
      
      profile!.allFlavors[flavor] = Math.min(newScore, 1)
    })

    profile.totalComments++
    profile.lastUpdated = new Date().toISOString()

    // Recalculate top flavors
    profile.topFlavors = Object.entries(profile.allFlavors)
      .map(([flavor, score]) => ({
        flavor,
        score,
        frequency: this.calculateFlavorFrequency(userId, flavor)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Keep top 10, display top 4

    this.userProfiles.set(userId, profile)
    this.persistProfile(profile)
  }

  private calculateFlavorFrequency(userId: string, flavor: string): number {
    // This would track how often a flavor appears in comments
    // For now, return a simple calculation
    const profile = this.userProfiles.get(userId)
    return profile ? Math.round((profile.allFlavors[flavor] || 0) * profile.totalComments) : 0
  }

  private trackFlavorUpdate(userId: string, analysis: FlavorAnalysis, commenterUserId?: string): void {
    try {
      const analytics = JSON.parse(localStorage.getItem('flavorAnalytics') || '[]')
      
      analytics.push({
        event: 'flavor_analysis',
        targetUserId: userId,
        commenterUserId,
        extractedFlavors: Object.keys(analysis.flavors),
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        timestamp: new Date().toISOString()
      })
      
      // Keep only last 1000 events
      if (analytics.length > 1000) {
        analytics.splice(0, analytics.length - 1000)
      }
      
      localStorage.setItem('flavorAnalytics', JSON.stringify(analytics))
    } catch (error) {
      console.error('Error tracking flavor analytics:', error)
    }
  }

  private loadExistingProfiles(): void {
    try {
      const stored = localStorage.getItem('userFlavorProfiles') || '{}'
      const profiles = JSON.parse(stored)
      
      Object.entries(profiles).forEach(([userId, profile]) => {
        this.userProfiles.set(userId, profile as UserFlavorProfile)
      })
    } catch (error) {
      console.error('Error loading flavor profiles:', error)
    }
  }

  private persistProfile(profile: UserFlavorProfile): void {
    try {
      const stored = localStorage.getItem('userFlavorProfiles') || '{}'
      const profiles = JSON.parse(stored)
      profiles[profile.userId] = profile
      localStorage.setItem('userFlavorProfiles', JSON.stringify(profiles))
    } catch (error) {
      console.error('Error persisting flavor profile:', error)
    }
  }

  // Real-time flavor updates for live comments
  processLiveComment(targetUserId: string, comment: string, commenterUserId?: string): {
    updatedFlavors: Array<{flavor: string, score: number}>
    newFlavorsDetected: string[]
    sentimentShift: number
  } {
    const beforeProfile = this.getUserFlavors(targetUserId)
    const beforeFlavors = beforeProfile ? beforeProfile.allFlavors : {}
    
    const analysis = this.analyzeComment(targetUserId, comment, commenterUserId)
    
    const afterProfile = this.getUserFlavors(targetUserId)!
    const newFlavorsDetected = Object.keys(analysis.flavors).filter(
      flavor => !beforeFlavors.hasOwnProperty(flavor)
    )
    
    return {
      updatedFlavors: this.getTopFlavors(targetUserId),
      newFlavorsDetected,
      sentimentShift: analysis.sentiment
    }
  }

  // Get flavor trends across the platform
  getFlavorTrends(): {
    mostPopularFlavors: Array<{flavor: string, userCount: number}>
    emergingFlavors: Array<{flavor: string, growthRate: number}>
    sentimentTrends: {positive: number, neutral: number, negative: number}
  } {
    const flavorCounts: Record<string, number> = {}
    let totalPositive = 0
    let totalNeutral = 0
    let totalNegative = 0
    let totalUsers = 0
    
    this.userProfiles.forEach(profile => {
      totalUsers++
      profile.topFlavors.forEach(flavor => {
        flavorCounts[flavor.flavor] = (flavorCounts[flavor.flavor] || 0) + 1
      })
      
      // This is simplified - in production we'd track sentiment history
      const avgSentiment = Object.values(profile.allFlavors).reduce((sum, score) => sum + score, 0) / Object.keys(profile.allFlavors).length
      if (avgSentiment > 0.6) totalPositive++
      else if (avgSentiment < 0.4) totalNegative++
      else totalNeutral++
    })
    
    const mostPopularFlavors = Object.entries(flavorCounts)
      .map(([flavor, count]) => ({flavor, userCount: count}))
      .sort((a, b) => b.userCount - a.userCount)
      .slice(0, 10)
    
    // Simplified emerging flavors (would need historical data for real growth rates)
    const emergingFlavors = mostPopularFlavors
      .filter(f => f.userCount > 2 && f.userCount < 10)
      .map(f => ({flavor: f.flavor, growthRate: Math.random() * 50 + 10})) // Mock growth rate
      .slice(0, 5)
    
    return {
      mostPopularFlavors,
      emergingFlavors,
      sentimentTrends: {
        positive: Math.round((totalPositive / totalUsers) * 100),
        neutral: Math.round((totalNeutral / totalUsers) * 100),
        negative: Math.round((totalNegative / totalUsers) * 100)
      }
    }
  }
}

// Export singleton instance
export const flavorAnalysis = new FlavorAnalysisEngine()

// Easy-to-use utility functions
export const flavorUtils = {
  // Analyze a single comment
  analyzeComment: (targetUserId: string, comment: string, commenterUserId?: string) => {
    return flavorAnalysis.analyzeComment(targetUserId, comment, commenterUserId)
  },
  
  // Get user's top flavors for profile display
  getUserFlavors: (userId: string) => {
    return flavorAnalysis.getTopFlavors(userId)
  },
  
  // Process real-time comment with live updates
  processLiveComment: (targetUserId: string, comment: string, commenterUserId?: string) => {
    return flavorAnalysis.processLiveComment(targetUserId, comment, commenterUserId)
  },
  
  // Get commercial targeting segments
  getCommercialSegments: () => {
    return flavorAnalysis.getCommercialSegments()
  },
  
  // Get platform-wide flavor trends
  getTrends: () => {
    return flavorAnalysis.getFlavorTrends()
  },
  
  // Batch process multiple comments
  batchAnalyze: (targetUserId: string, comments: string[]) => {
    return flavorAnalysis.batchAnalyzeComments(targetUserId, comments)
  }
} 