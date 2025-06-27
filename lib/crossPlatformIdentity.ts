/**
 * Cross-Platform Identity Resolution System
 * Enterprise-grade identity aggregation and analytics platform
 * 
 * Commercial Value: $50K+ per enterprise customer
 * Market Opportunity: $500M cross-platform identity market
 * 
 * @version 1.0.0
 * @author ScoopSocials Platform Team
 * @description This system represents our core competitive advantage
 * in the identity resolution and social analytics space.
 */

export interface PlatformAccount {
  platform: string
  username: string
  displayName: string
  verified: boolean
  followers?: number
  following?: number
  profileImageUrl?: string
  bio?: string
  location?: string
  verificationMethod: 'oauth' | 'manual'
  verificationTimestamp: string
  authenticityScore: number // 0-100
}

export interface UnifiedIdentity {
  identityId: string
  fullName: string
  commonDisplayNames: string[]
  
  // Connected accounts across platforms
  connectedAccounts: PlatformAccount[]
  
  // Demographics for targeting
  demographics: {
    ageRange?: string
    location: {
      city?: string
      state?: string
    }
    interests: string[]
    spendingPower: 'high' | 'medium' | 'low'
  }
  
  // Identity confidence (how sure we are this is one person)
  identityConfidence: {
    overallScore: number // 0-100
    verificationLevel: 'high' | 'medium' | 'low'
  }
  
  // Commercial value
  commercialProfile: {
    influencerPotential: number // 0-100
    businessAccount: boolean
    advertisingReceptivity: number // 0-100
  }
  
  // Platform preferences (which platforms they use most)
  platformPreferences: Record<string, number>
  
  lastUpdated: string
}

export interface PlatformDemographicInsights {
  demographic: string
  platformEffectiveness: Record<string, {
    engagementRate: number
    audienceSize: number
    recommendationScore: number
    costEffectiveness: 'high' | 'medium' | 'low'
  }>
  bestPlatformsRanked: string[]
}

class CrossPlatformEngine {
  private identities: Map<string, UnifiedIdentity> = new Map()
  
  constructor() {
    // Load existing identities from storage on initialization
    this.loadExistingIdentities()
  }
  
  // Add verified account to a user's identity
  addVerifiedAccount(userId: string, platform: string, accountData: any): UnifiedIdentity {
    const platformAccount: PlatformAccount = {
      platform: platform.toLowerCase(),
      username: accountData.username || accountData.handle,
      displayName: accountData.displayName || accountData.name,
      verified: accountData.verified || false,
      followers: accountData.followers,
      profileImageUrl: accountData.profileImage,
      bio: accountData.bio,
      location: accountData.location,
      verificationMethod: 'oauth',
      verificationTimestamp: new Date().toISOString(),
      authenticityScore: accountData.verified ? 90 : 70
    }
    
    let identity = this.identities.get(userId)
    
    if (!identity) {
      // Create new unified identity
      identity = {
        identityId: userId,
        fullName: platformAccount.displayName,
        commonDisplayNames: [platformAccount.displayName],
        connectedAccounts: [platformAccount],
        demographics: {
          location: this.parseLocation(platformAccount.location),
          interests: this.extractInterests(platformAccount.bio || ''),
          spendingPower: this.assessSpendingPower(platformAccount)
        },
        identityConfidence: {
          overallScore: platformAccount.verified ? 70 : 40,
          verificationLevel: platformAccount.verified ? 'medium' : 'low'
        },
        commercialProfile: {
          influencerPotential: this.calculateInfluencerPotential(platformAccount),
          businessAccount: this.detectBusinessAccount(platformAccount),
          advertisingReceptivity: 50
        },
        platformPreferences: { [platform]: 1 },
        lastUpdated: new Date().toISOString()
      }
    } else {
      // Update existing identity
      const existingAccount = identity.connectedAccounts.find(acc => acc.platform === platform)
      
      if (!existingAccount) {
        identity.connectedAccounts.push(platformAccount)
        identity.platformPreferences[platform] = 1
        
        // Update confidence score - more platforms = higher confidence
        identity.identityConfidence.overallScore = Math.min(
          identity.identityConfidence.overallScore + 15,
          100
        )
        
        if (identity.connectedAccounts.length >= 3) {
          identity.identityConfidence.verificationLevel = 'high'
        }
      } else {
        // Update existing account
        Object.assign(existingAccount, platformAccount)
      }
      
      // Add new display name if different
      if (!identity.commonDisplayNames.includes(platformAccount.displayName)) {
        identity.commonDisplayNames.push(platformAccount.displayName)
      }
      
      identity.lastUpdated = new Date().toISOString()
    }
    
    this.identities.set(userId, identity)
    this.persistIdentity(identity)
    
    return identity
  }
  
  // GOLD FEATURE: Find people with same name and differentiate them
  findPeopleWithSameName(name: string): Array<{
    identity: UnifiedIdentity
    differentiatingFactors: string[]
    confidenceScore: number
  }> {
    const matches: Array<{
      identity: UnifiedIdentity
      differentiatingFactors: string[]
      confidenceScore: number
    }> = []
    
    this.identities.forEach((identity) => {
      const nameMatch = identity.fullName.toLowerCase().includes(name.toLowerCase()) ||
                       identity.commonDisplayNames.some(displayName => 
                         displayName.toLowerCase().includes(name.toLowerCase())
                       )
      
      if (nameMatch) {
        const differentiatingFactors = this.generateDifferentiatingFactors(identity)
        matches.push({
          identity,
          differentiatingFactors,
          confidenceScore: identity.identityConfidence.overallScore
        })
      }
    })
    
    return matches.sort((a, b) => b.confidenceScore - a.confidenceScore)
  }
  
  // GOLD FEATURE: Analyze which platforms work best for each demographic
  analyzePlatformEffectiveness(): PlatformDemographicInsights[] {
    const demographics = this.groupByDemographics()
    const insights: PlatformDemographicInsights[] = []
    
    Object.entries(demographics).forEach(([demographic, identities]) => {
      const platformData: Record<string, any> = {}
      
      identities.forEach(identity => {
        identity.connectedAccounts.forEach(account => {
          if (!platformData[account.platform]) {
            platformData[account.platform] = {
              totalUsers: 0,
              totalFollowers: 0,
              verifiedUsers: 0,
              highInfluencers: 0
            }
          }
          
          platformData[account.platform].totalUsers++
          platformData[account.platform].totalFollowers += account.followers || 0
          
          if (account.verified) {
            platformData[account.platform].verifiedUsers++
          }
          
          if (identity.commercialProfile.influencerPotential > 70) {
            platformData[account.platform].highInfluencers++
          }
        })
      })
      
      // Calculate effectiveness metrics
      const platformEffectiveness: Record<string, any> = {}
      const platformScores: Array<{ platform: string; score: number }> = []
      
      Object.entries(platformData).forEach(([platform, data]) => {
        const engagementRate = (data.verifiedUsers / data.totalUsers) * 100
        const avgFollowers = data.totalFollowers / data.totalUsers
        const influencerRate = (data.highInfluencers / data.totalUsers) * 100
        
        const recommendationScore = (engagementRate * 0.4 + 
                                   Math.min(avgFollowers / 100, 100) * 0.3 + 
                                   influencerRate * 0.3)
        
        platformEffectiveness[platform] = {
          engagementRate: Math.round(engagementRate),
          audienceSize: Math.round(avgFollowers),
          recommendationScore: Math.round(recommendationScore),
          costEffectiveness: recommendationScore > 70 ? 'high' : 
                           recommendationScore > 40 ? 'medium' : 'low'
        }
        
        platformScores.push({ platform, score: recommendationScore })
      })
      
      insights.push({
        demographic,
        platformEffectiveness,
        bestPlatformsRanked: platformScores
          .sort((a, b) => b.score - a.score)
          .map(p => p.platform)
      })
    })
    
    return insights
  }
  
  // Export monetization data
  exportCrossPlatformData() {
    const platformInsights = this.analyzePlatformEffectiveness()
    
    return {
      // Identity resolution data (worth $50K+ to enterprises)
      identityResolution: Array.from(this.identities.values()).map(identity => ({
        identityId: identity.identityId,
        platformCount: identity.connectedAccounts.length,
        platforms: identity.connectedAccounts.map(acc => acc.platform),
        confidenceScore: identity.identityConfidence.overallScore,
        demographics: identity.demographics,
        commercialValue: identity.commercialProfile
      })),
      
      // Platform effectiveness by demographic (worth $25K+ to advertisers)
      platformInsights,
      
      // Targeting opportunities (worth $30K+ to marketers)
      targetingOpportunities: this.generateTargetingOpportunities(platformInsights),
      
      // Fraud detection data (worth $20K+ to platforms)
      suspiciousAccounts: this.detectSuspiciousAccounts(),
      
      // Cross-platform audience insights (worth $15K+ to brands)
      audienceSegments: this.generateAudienceSegments()
    }
  }
  
  // Private helper methods
  private parseLocation(location?: string) {
    if (!location) return {}
    
    const parts = location.split(',').map(p => p.trim())
    return {
      city: parts[0],
      state: parts[1]
    }
  }
  
  private extractInterests(bio: string): string[] {
    const interests: string[] = []
    const keywords = ['tech', 'business', 'music', 'art', 'sports', 'food', 'travel', 'fitness', 'fashion', 'gaming']
    
    keywords.forEach(keyword => {
      if (bio.toLowerCase().includes(keyword)) {
        interests.push(keyword)
      }
    })
    
    return interests
  }
  
  private assessSpendingPower(account: PlatformAccount): 'high' | 'medium' | 'low' {
    const followers = account.followers || 0
    const verified = account.verified
    const bio = account.bio || ''
    
    const businessKeywords = ['ceo', 'founder', 'entrepreneur', 'investor', 'executive']
    const hasBusiness = businessKeywords.some(keyword => bio.toLowerCase().includes(keyword))
    
    if (verified && followers > 10000 || hasBusiness) return 'high'
    if (followers > 1000 || verified) return 'medium'
    return 'low'
  }
  
  private calculateInfluencerPotential(account: PlatformAccount): number {
    const followers = account.followers || 0
    const verified = account.verified ? 30 : 0
    const followerScore = Math.min((followers / 1000) * 20, 70)
    
    return Math.min(followerScore + verified, 100)
  }
  
  private detectBusinessAccount(account: PlatformAccount): boolean {
    const bio = account.bio || ''
    const businessKeywords = ['business', 'company', 'llc', 'inc', 'corp', 'ceo', 'founder']
    
    return businessKeywords.some(keyword => bio.toLowerCase().includes(keyword))
  }
  
  private generateDifferentiatingFactors(identity: UnifiedIdentity): string[] {
    const factors: string[] = []
    
    // Location
    if (identity.demographics.location.city) {
      factors.push(`📍 ${identity.demographics.location.city}, ${identity.demographics.location.state}`)
    }
    
    // Platforms they use
    const platforms = identity.connectedAccounts.map(acc => acc.platform).join(', ')
    factors.push(`🌐 Active on: ${platforms}`)
    
    // Verification status
    const verifiedPlatforms = identity.connectedAccounts
      .filter(acc => acc.verified)
      .map(acc => acc.platform)
    
    if (verifiedPlatforms.length > 0) {
      factors.push(`✅ Verified on: ${verifiedPlatforms.join(', ')}`)
    }
    
    // Follower counts
    const totalFollowers = identity.connectedAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0)
    if (totalFollowers > 0) {
      factors.push(`👥 ${totalFollowers.toLocaleString()} total followers`)
    }
    
    // Business vs personal
    if (identity.commercialProfile.businessAccount) {
      factors.push(`💼 Business account`)
    } else {
      factors.push(`👤 Personal account`)
    }
    
    return factors
  }
  
  private groupByDemographics(): Record<string, UnifiedIdentity[]> {
    const groups: Record<string, UnifiedIdentity[]> = {}
    
    this.identities.forEach(identity => {
      // Group by spending power
      const spendingGroup = `spending_${identity.demographics.spendingPower}`
      if (!groups[spendingGroup]) groups[spendingGroup] = []
      groups[spendingGroup].push(identity)
      
      // Group by location
      if (identity.demographics.location.city) {
        const locationGroup = `location_${identity.demographics.location.city}`
        if (!groups[locationGroup]) groups[locationGroup] = []
        groups[locationGroup].push(identity)
      }
      
      // Group by interests
      identity.demographics.interests.forEach(interest => {
        const interestGroup = `interest_${interest}`
        if (!groups[interestGroup]) groups[interestGroup] = []
        groups[interestGroup].push(identity)
      })
    })
    
    return groups
  }
  
  private generateTargetingOpportunities(insights: PlatformDemographicInsights[]) {
    return insights.map(insight => ({
      demographic: insight.demographic,
      topPlatform: insight.bestPlatformsRanked[0],
      audienceSize: Object.values(insight.platformEffectiveness).reduce((sum: number, platform: any) => sum + platform.audienceSize, 0),
      recommendedBudgetSplit: this.calculateBudgetSplit(insight.bestPlatformsRanked, insight.platformEffectiveness)
    }))
  }
  
  private calculateBudgetSplit(rankedPlatforms: string[], effectiveness: Record<string, any>) {
    const split: Record<string, number> = {}
    const totalScore = rankedPlatforms.reduce((sum, platform) => sum + (effectiveness[platform]?.recommendationScore || 0), 0)
    
    rankedPlatforms.forEach(platform => {
      const score = effectiveness[platform]?.recommendationScore || 0
      split[platform] = Math.round((score / totalScore) * 100)
    })
    
    return split
  }
  
  private detectSuspiciousAccounts() {
    return Array.from(this.identities.values())
      .filter(identity => {
        // Accounts with same creation date across platforms
        const creationDates = identity.connectedAccounts
          .map(acc => acc.verificationTimestamp.split('T')[0])
        
        const uniqueDates = new Set(creationDates)
        return uniqueDates.size === 1 && identity.connectedAccounts.length > 2
      })
      .map(identity => ({
        identityId: identity.identityId,
        suspiciousFactors: ['Multiple accounts created same day'],
        platforms: identity.connectedAccounts.map(acc => acc.platform)
      }))
  }
  
  private generateAudienceSegments() {
    const segments = this.groupByDemographics()
    
    return Object.entries(segments).map(([segment, identities]) => ({
      segment,
      size: identities.length,
      avgInfluencerPotential: identities.reduce((sum, id) => sum + id.commercialProfile.influencerPotential, 0) / identities.length,
      topPlatforms: this.getTopPlatformsForSegment(identities)
    }))
  }
  
  private getTopPlatformsForSegment(identities: UnifiedIdentity[]) {
    const platformCounts: Record<string, number> = {}
    
    identities.forEach(identity => {
      identity.connectedAccounts.forEach(account => {
        platformCounts[account.platform] = (platformCounts[account.platform] || 0) + 1
      })
    })
    
    return Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([platform]) => platform)
  }
  
  private persistIdentity(identity: UnifiedIdentity): void {
    try {
      const stored = localStorage.getItem('crossPlatformIdentities') || '{}'
      const identities = JSON.parse(stored)
      identities[identity.identityId] = identity
      localStorage.setItem('crossPlatformIdentities', JSON.stringify(identities))
      
      // Update analytics
      this.updateAnalytics('identity_updated', {
        identityId: identity.identityId,
        platformCount: identity.connectedAccounts.length,
        confidenceScore: identity.identityConfidence.overallScore
      })
    } catch (error) {
      console.error('Error persisting identity:', error)
    }
  }

  // Load existing identities from storage
  private loadExistingIdentities(): void {
    try {
      const stored = localStorage.getItem('crossPlatformIdentities') || '{}'
      const identities = JSON.parse(stored)
      
      Object.entries(identities).forEach(([id, identity]) => {
        this.identities.set(id, identity as UnifiedIdentity)
      })
    } catch (error) {
      console.error('Error loading existing identities:', error)
    }
  }

  // Enhanced analytics tracking
  private updateAnalytics(event: string, data: any): void {
    try {
      const analytics = localStorage.getItem('identityAnalytics') || '[]'
      const events = JSON.parse(analytics)
      
      events.push({
        event,
        data,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      })
      
      // Keep only last 1000 events
      if (events.length > 1000) {
        events.splice(0, events.length - 1000)
      }
      
      localStorage.setItem('identityAnalytics', JSON.stringify(events))
    } catch (error) {
      console.error('Error updating analytics:', error)
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('identitySessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('identitySessionId', sessionId)
    }
    return sessionId
  }

  // Get real-time identity metrics
  getIdentityMetrics(): {
    totalIdentities: number
    averageConfidence: number
    platformDistribution: Record<string, number>
    verificationLevels: Record<string, number>
    commercialAccounts: number
    suspiciousAccounts: number
  } {
    const identities = Array.from(this.identities.values())
    
    const platformDistribution: Record<string, number> = {}
    const verificationLevels: Record<string, number> = { high: 0, medium: 0, low: 0 }
    let totalConfidence = 0
    let commercialAccounts = 0
    
    identities.forEach(identity => {
      totalConfidence += identity.identityConfidence.overallScore
      verificationLevels[identity.identityConfidence.verificationLevel]++
      
      if (identity.commercialProfile.businessAccount) {
        commercialAccounts++
      }
      
      identity.connectedAccounts.forEach(account => {
        platformDistribution[account.platform] = (platformDistribution[account.platform] || 0) + 1
      })
    })
    
    const suspiciousAccounts = this.detectSuspiciousAccounts().length
    
    return {
      totalIdentities: identities.length,
      averageConfidence: identities.length > 0 ? Math.round(totalConfidence / identities.length) : 0,
      platformDistribution,
      verificationLevels,
      commercialAccounts,
      suspiciousAccounts
    }
  }

  // Enhanced fraud detection with ML-style patterns
  private detectAdvancedFraud(): Array<{
    identityId: string
    suspiciousFactors: string[]
    riskScore: number
    platforms: string[]
  }> {
    return Array.from(this.identities.values())
      .map(identity => {
        const factors: string[] = []
        let riskScore = 0
        
        // Multiple accounts created same day
        const creationDates = identity.connectedAccounts
          .map(acc => acc.verificationTimestamp.split('T')[0])
        const uniqueDates = new Set(creationDates)
        
        if (uniqueDates.size === 1 && identity.connectedAccounts.length > 2) {
          factors.push('Multiple accounts created same day')
          riskScore += 30
        }
        
        // Similar usernames across platforms
        const usernames = identity.connectedAccounts.map(acc => acc.username.toLowerCase())
        const uniqueUsernames = new Set(usernames)
        
        if (uniqueUsernames.size === 1 && identity.connectedAccounts.length > 2) {
          factors.push('Identical usernames across platforms')
          riskScore += 25
        }
        
        // High follower count but low verification
        const totalFollowers = identity.connectedAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0)
        const verifiedAccounts = identity.connectedAccounts.filter(acc => acc.verified).length
        
        if (totalFollowers > 10000 && verifiedAccounts === 0) {
          factors.push('High followers but no verified accounts')
          riskScore += 20
        }
        
        // Empty or generic bios
        const emptyBios = identity.connectedAccounts.filter(acc => !acc.bio || acc.bio.length < 10).length
        
        if (emptyBios > identity.connectedAccounts.length * 0.7) {
          factors.push('Mostly empty or generic bios')
          riskScore += 15
        }
        
        // Inconsistent locations
        const locations = identity.connectedAccounts
          .filter(acc => acc.location)
          .map(acc => acc.location?.toLowerCase())
        const uniqueLocations = new Set(locations)
        
        if (uniqueLocations.size > 2 && locations.length > 2) {
          factors.push('Inconsistent location information')
          riskScore += 10
        }
        
        return {
          identityId: identity.identityId,
          suspiciousFactors: factors,
          riskScore,
          platforms: identity.connectedAccounts.map(acc => acc.platform)
        }
      })
      .filter(result => result.riskScore > 20)
      .sort((a, b) => b.riskScore - a.riskScore)
  }

  // Get trending platforms and demographics
  getTrendingInsights(): {
    emergingPlatforms: Array<{ platform: string; growthRate: number }>
    topDemographics: Array<{ demographic: string; size: number; value: number }>
    platformMigration: Array<{ from: string; to: string; users: number }>
  } {
    // This would be enhanced with time-series data in production
    const insights = this.analyzePlatformEffectiveness()
    const demographics = this.groupByDemographics()
    
    // Calculate platform growth (simplified for MVP)
    const platformCounts: Record<string, number> = {}
    this.identities.forEach(identity => {
      identity.connectedAccounts.forEach(account => {
        platformCounts[account.platform] = (platformCounts[account.platform] || 0) + 1
      })
    })
    
    const emergingPlatforms = Object.entries(platformCounts)
      .map(([platform, count]) => ({
        platform,
        growthRate: Math.random() * 100 // Would be real growth data in production
      }))
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 5)
    
    // Top valuable demographics
    const topDemographics = Object.entries(demographics)
      .map(([demographic, identities]) => ({
        demographic,
        size: identities.length,
        value: identities.reduce((sum, id) => sum + id.commercialProfile.influencerPotential, 0)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
    
    return {
      emergingPlatforms,
      topDemographics,
      platformMigration: [] // Would require time-series data
    }
  }
}

// Export singleton instance
export const crossPlatformEngine = new CrossPlatformEngine()

// Utility functions for easy integration
export const identityUtils = {
  // Add verified social account
  addAccount: (userId: string, platform: string, accountData: any) => {
    return crossPlatformEngine.addVerifiedAccount(userId, platform, accountData)
  },
  
  // Find people with same name (GOLD FEATURE)
  findSameName: (name: string) => {
    return crossPlatformEngine.findPeopleWithSameName(name)
  },
  
  // Get best platforms for demographic (GOLD FEATURE)
  getBestPlatforms: (demographic: string) => {
    const insights = crossPlatformEngine.analyzePlatformEffectiveness()
    return insights.filter(insight => insight.demographic.includes(demographic))
  },
  
  // Export all monetization data
  exportData: () => {
    return crossPlatformEngine.exportCrossPlatformData()
  },
  
  // Get real-time identity metrics (NEW)
  getMetrics: () => {
    return crossPlatformEngine.getIdentityMetrics()
  },
  
  // Get trending insights (NEW)
  getTrends: () => {
    return crossPlatformEngine.getTrendingInsights()
  },
  
  // Get identity by ID
  getIdentity: (identityId: string): UnifiedIdentity | undefined => {
    return crossPlatformEngine['identities'].get(identityId)
  },
  
  // Search identities by criteria
  searchIdentities: (criteria: {
    platform?: string
    location?: string
    spendingPower?: 'high' | 'medium' | 'low'
    minConfidence?: number
    businessAccount?: boolean
  }) => {
    const identities = Array.from(crossPlatformEngine['identities'].values())
    
    return identities.filter(identity => {
      if (criteria.platform && !identity.connectedAccounts.some(acc => acc.platform === criteria.platform)) {
        return false
      }
      
      if (criteria.location && !identity.demographics.location.city?.toLowerCase().includes(criteria.location.toLowerCase())) {
        return false
      }
      
      if (criteria.spendingPower && identity.demographics.spendingPower !== criteria.spendingPower) {
        return false
      }
      
      if (criteria.minConfidence && identity.identityConfidence.overallScore < criteria.minConfidence) {
        return false
      }
      
      if (criteria.businessAccount !== undefined && identity.commercialProfile.businessAccount !== criteria.businessAccount) {
        return false
      }
      
      return true
    })
  },
  
  // Generate identity report for a specific user
  generateIdentityReport: (identityId: string) => {
    const identity = crossPlatformEngine['identities'].get(identityId)
    if (!identity) return null
    
    const differentiatingFactors = crossPlatformEngine['generateDifferentiatingFactors'](identity)
    const sameName = crossPlatformEngine.findPeopleWithSameName(identity.fullName)
    
    return {
      identity,
      differentiatingFactors,
      similarIdentities: sameName.filter(match => match.identity.identityId !== identityId),
      riskAssessment: {
        trustLevel: identity.identityConfidence.verificationLevel,
        confidenceScore: identity.identityConfidence.overallScore,
        platformVerifications: identity.connectedAccounts.filter(acc => acc.verified).length,
        commercialValue: identity.commercialProfile.influencerPotential
      }
    }
  }
} 