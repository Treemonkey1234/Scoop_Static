// SEO Utilities for ScoopSocials Platform
// Generates meta tags, structured data, and optimization helpers

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  image?: string
  type?: 'website' | 'article' | 'event' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

export interface EventSEOData {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: {
    name: string
    address: string
    city: string
    state: string
  }
  organizer: {
    name: string
    url?: string
  }
  price?: number
  category: string
  image?: string
}

export interface PersonSEOData {
  name: string
  jobTitle?: string
  description: string
  image?: string
  url?: string
  location?: string
  trustScore?: number
  socialLinks?: Record<string, string>
}

class SEOManager {
  private static instance: SEOManager
  private baseUrl: string = 'https://scoopsocials.com' // Update with your domain

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager()
    }
    return SEOManager.instance
  }

  // Generate comprehensive meta tags
  generateMetaTags(config: SEOConfig): string {
    const {
      title,
      description,
      keywords = [],
      canonical,
      image = '/scoop-logo.png',
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      section
    } = config

    const fullTitle = `${title} | ScoopSocials - Trust-Based Social Platform`
    const fullImage = image.startsWith('http') ? image : `${this.baseUrl}${image}`
    const fullCanonical = canonical || this.baseUrl

    return `
      <!-- Primary Meta Tags -->
      <title>${fullTitle}</title>
      <meta name="title" content="${fullTitle}" />
      <meta name="description" content="${description}" />
      <meta name="keywords" content="${keywords.join(', ')}, social platform, trust score, events, networking, Phoenix" />
      <meta name="author" content="${author || 'ScoopSocials'}" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href="${fullCanonical}" />

      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="${type}" />
      <meta property="og:url" content="${fullCanonical}" />
      <meta property="og:title" content="${fullTitle}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${fullImage}" />
      <meta property="og:site_name" content="ScoopSocials" />
      <meta property="og:locale" content="en_US" />
      ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
      ${modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : ''}
      ${author ? `<meta property="article:author" content="${author}" />` : ''}
      ${section ? `<meta property="article:section" content="${section}" />` : ''}

      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="${fullCanonical}" />
      <meta property="twitter:title" content="${fullTitle}" />
      <meta property="twitter:description" content="${description}" />
      <meta property="twitter:image" content="${fullImage}" />
      <meta property="twitter:site" content="@ScoopSocials" />
      <meta property="twitter:creator" content="@ScoopSocials" />

      <!-- Additional SEO -->
      <meta name="theme-color" content="#06b6d4" />
      <meta name="msapplication-TileColor" content="#06b6d4" />
    `.trim()
  }

  // Generate structured data for events
  generateEventStructuredData(event: EventSEOData): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.name,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate || event.startDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": event.location.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": event.location.address,
          "addressLocality": event.location.city,
          "addressRegion": event.location.state,
          "addressCountry": "US"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": event.organizer.name,
        "url": event.organizer.url || this.baseUrl
      },
      "offers": event.price ? {
        "@type": "Offer",
        "price": event.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      } : {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "category": event.category,
      "image": event.image ? (event.image.startsWith('http') ? event.image : `${this.baseUrl}${event.image}`) : `${this.baseUrl}/scoop-logo.png`
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  // Generate structured data for persons/profiles
  generatePersonStructuredData(person: PersonSEOData): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": person.name,
      "jobTitle": person.jobTitle,
      "description": person.description,
      "image": person.image ? (person.image.startsWith('http') ? person.image : `${this.baseUrl}${person.image}`) : `${this.baseUrl}/scoop-logo.png`,
      "url": person.url || this.baseUrl,
      "address": person.location ? {
        "@type": "PostalAddress",
        "addressLocality": person.location.split(',')[0]?.trim(),
        "addressRegion": person.location.split(',')[1]?.trim(),
        "addressCountry": "US"
      } : undefined,
      "knowsAbout": person.trustScore ? [`Trust Score: ${person.trustScore}`, "Social Networking", "Community Building"] : ["Social Networking", "Community Building"],
      "sameAs": person.socialLinks ? Object.values(person.socialLinks).filter(link => link && link.trim()) : []
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  // Generate organization structured data
  generateOrganizationStructuredData(): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ScoopSocials",
      "alternateName": "Scoop Social Platform",
      "description": "Trust-based social networking platform connecting communities through verified profiles and local events",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/scoop-logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "areaServed": "US",
        "availableLanguage": "en"
      },
      "sameAs": [
        "https://twitter.com/ScoopSocials",
        "https://facebook.com/ScoopSocials",
        "https://instagram.com/ScoopSocials"
      ],
      "founder": {
        "@type": "Person",
        "name": "ScoopSocials Team"
      },
      "foundingDate": "2024",
      "knowsAbout": [
        "Social Networking",
        "Trust-based Communities",
        "Event Management",
        "Local Business Networking",
        "Community Building"
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 33.4484,
          "longitude": -112.0740
        },
        "geoRadius": "50"
      }
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url.startsWith('http') ? crumb.url : `${this.baseUrl}${crumb.url}`
      }))
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  // Generate keyword opportunities based on collected data
  generateKeywordOpportunities(userData: any[]): string[] {
    const keywords = new Set<string>()
    
    // Base keywords
    const baseKeywords = [
      'social networking Phoenix',
      'trust-based social platform',
      'verified social network',
      'local events Phoenix',
      'networking events near me',
      'professional networking Phoenix',
      'social media verification',
      'community trust score',
      'local business networking',
      'Phoenix social events'
    ]
    
    baseKeywords.forEach(keyword => keywords.add(keyword))

    // Extract from user data
    userData.forEach(user => {
      if (user.interests?.eventTypes) {
        user.interests.eventTypes.forEach((type: string) => {
          keywords.add(`${type} events Phoenix`)
          keywords.add(`${type} networking Phoenix`)
        })
      }
      
      if (user.interests?.searchTerms) {
        user.interests.searchTerms.forEach((term: string) => {
          if (term.length > 3) {
            keywords.add(`${term} Phoenix`)
            keywords.add(`${term} social network`)
          }
        })
      }
      
      if (user.location?.city) {
        keywords.add(`social networking ${user.location.city}`)
        keywords.add(`events in ${user.location.city}`)
      }
    })

    return Array.from(keywords)
  }

  // Generate local business SEO data
  generateLocalBusinessData(businessData: any): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": businessData.name,
      "image": businessData.image,
      "telephone": businessData.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": businessData.address,
        "addressLocality": businessData.city,
        "addressRegion": businessData.state,
        "postalCode": businessData.zipCode,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": businessData.latitude,
        "longitude": businessData.longitude
      },
      "url": businessData.website,
      "priceRange": businessData.priceRange || "$$",
      "openingHoursSpecification": businessData.hours || [],
      "aggregateRating": businessData.rating ? {
        "@type": "AggregateRating",
        "ratingValue": businessData.rating,
        "reviewCount": businessData.reviewCount || 1
      } : undefined
    }

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`
  }

  // Export SEO data for external tools
  exportSEOData(userData: any[], events: any[], profiles: any[]) {
    return {
      keywords: this.generateKeywordOpportunities(userData),
      content_gaps: this.identifyContentGaps(userData),
      local_opportunities: this.identifyLocalOpportunities(events),
      competitor_analysis: this.generateCompetitorKeywords(),
      seasonal_trends: this.identifySeasonalTrends(events),
      long_tail_keywords: this.generateLongTailKeywords(userData)
    }
  }

  private identifyContentGaps(userData: any[]): string[] {
    const gaps: string[] = []
    const interests = new Set<string>()
    
    userData.forEach(user => {
      if (user.interests?.categories) {
        user.interests.categories.forEach((cat: string) => interests.add(cat))
      }
    })

    // Identify missing content opportunities
    const commonInterests = ['technology', 'food', 'fitness', 'arts', 'business', 'social']
    commonInterests.forEach(interest => {
      if (!interests.has(interest)) {
        gaps.push(`${interest} content opportunity`)
      }
    })

    return gaps
  }

  private identifyLocalOpportunities(events: any[]): string[] {
    const opportunities: string[] = []
    const locations = new Set<string>()
    
    events.forEach(event => {
      if (event.location) {
        locations.add(event.location)
      }
    })

    locations.forEach(location => {
      opportunities.push(`SEO opportunity: ${location} events`)
      opportunities.push(`Local business partnership: ${location}`)
    })

    return opportunities
  }

  private generateCompetitorKeywords(): string[] {
    return [
      'alternative to Facebook events',
      'better than Meetup',
      'verified social network',
      'trust-based community platform',
      'professional networking alternative',
      'local events app Phoenix',
      'social media with trust scores',
      'verified profile social network'
    ]
  }

  private identifySeasonalTrends(events: any[]): Record<string, string[]> {
    return {
      spring: ['outdoor events Phoenix', 'spring networking', 'Phoenix hiking events'],
      summer: ['summer events Phoenix', 'pool parties Phoenix', 'outdoor concerts'],
      fall: ['fall networking Phoenix', 'business events Phoenix', 'professional meetups'],
      winter: ['indoor events Phoenix', 'holiday networking', 'year-end business events']
    }
  }

  private generateLongTailKeywords(userData: any[]): string[] {
    const longTail: string[] = []
    
    // Generate specific long-tail keywords
    longTail.push(
      'how to build trust score on social media',
      'verified social networking platform Phoenix',
      'professional networking events Phoenix Arizona',
      'trust-based social media platform reviews',
      'local business networking Phoenix downtown',
      'social media platform with verification system',
      'Phoenix tech meetups and networking events',
      'how to find trusted people for business networking'
    )

    return longTail
  }
}

// Export singleton instance
export const seoManager = SEOManager.getInstance()

// Predefined SEO templates
export const seoTemplates = {
  homePage: {
    title: "Trust-Based Social Networking Platform",
    description: "Join ScoopSocials, the verified social platform where trust scores connect authentic people. Discover local events, build meaningful connections, and grow your professional network in Phoenix.",
    keywords: ["social networking", "trust score", "verified profiles", "local events", "Phoenix networking", "professional community"]
  },
  
  eventsPage: {
    title: "Discover Local Events & Networking",
    description: "Find and join verified local events in Phoenix. Connect with trusted community members through professional networking, social gatherings, and skill-building workshops.",
    keywords: ["Phoenix events", "local networking", "professional meetups", "social events", "verified events", "community gatherings"]
  },
  
  profilePage: {
    title: "Professional Profile & Trust Score",
    description: "Build your trusted professional profile with verified social connections. Showcase your expertise, connect with local professionals, and grow your network.",
    keywords: ["professional profile", "trust score", "verified connections", "Phoenix professionals", "networking profile", "business networking"]
  }
} 