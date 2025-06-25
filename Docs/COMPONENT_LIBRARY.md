# 🎨 ScoopSocials Component Library

## **Complete UI Component Reference & Design System**

This guide provides comprehensive documentation for all UI components, styling patterns, and design system elements needed to rebuild the ScoopSocials interface.

---

## **1. Design System Foundation**

### **1.1 Color Palette**
```typescript
// lib/design/colors.ts
export const Colors = {
  // Primary Brand Colors
  primary: {
    50: '#ecfeff',
    100: '#cffafe', 
    500: '#06b6d4', // Main cyan
    600: '#0891b2',
    700: '#0e7490'
  },
  
  // Trust Score Colors
  trust: {
    new: '#94a3b8',        // 0-49
    starting: '#64748b',   // 50-69
    verified: '#06b6d4',   // 70-79
    trusted: '#10b981',    // 80-89
    highly: '#8b5cf6',     // 90-95
    elite: '#f59e0b'       // 96-100
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
}
```

### **1.2 Typography Scale**
```typescript
// lib/design/typography.ts
export const Typography = {
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif']
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem'   // 24px
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

---

## **2. Core UI Components**

### **2.1 Button Component**
```typescript
// components/ui/Button.tsx
import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  onClick?: () => void
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    outline: 'border-2 border-slate-300 text-slate-700 hover:border-slate-400',
    ghost: 'text-slate-600 hover:bg-slate-100'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  )
  
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
```

### **2.2 Input Component**
```typescript
// components/ui/Input.tsx
import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  fullWidth?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  fullWidth = false,
  className,
  ...props
}) => {
  const inputClasses = clsx(
    'block w-full px-3 py-2 border rounded-lg transition-colors',
    'focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
    error ? 'border-red-300' : 'border-slate-300',
    className
  )
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input className={inputClasses} {...props} />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-slate-500">{helper}</p>
      )}
    </div>
  )
}
```

### **2.3 Card Component**
```typescript
// components/ui/Card.tsx
import React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  className
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const classes = clsx(
    'bg-white shadow-soft rounded-2xl',
    paddingClasses[padding],
    className
  )
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}
```

---

## **3. Specialized Components**

### **3.1 Trust Score Badge**
```typescript
// components/ui/TrustScoreBadge.tsx
import React from 'react'
import { clsx } from 'clsx'

interface TrustScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = false
}) => {
  const getTrustLevel = (score: number) => {
    if (score >= 96) return { level: 'Elite', color: '#f59e0b', bg: 'bg-yellow-100' }
    if (score >= 90) return { level: 'Highly Trusted', color: '#8b5cf6', bg: 'bg-purple-100' }
    if (score >= 80) return { level: 'Trusted', color: '#10b981', bg: 'bg-green-100' }
    if (score >= 70) return { level: 'Verified', color: '#06b6d4', bg: 'bg-cyan-100' }
    if (score >= 50) return { level: 'Getting Started', color: '#64748b', bg: 'bg-slate-100' }
    return { level: 'New User', color: '#94a3b8', bg: 'bg-slate-100' }
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const trust = getTrustLevel(score)
  
  return (
    <div className={clsx(
      'inline-flex items-center space-x-1 rounded-full font-semibold',
      sizeClasses[size],
      trust.bg
    )}>
      <span style={{ color: trust.color }}>{score}</span>
      {showLabel && (
        <span style={{ color: trust.color }} className="text-xs">
          {trust.level}
        </span>
      )}
    </div>
  )
}
```

### **3.2 Review Card Component**
```typescript
// components/ui/ReviewCard.tsx
import React from 'react'
import { Card } from './Card'
import { formatDistanceToNow } from 'date-fns'

interface ReviewCardProps {
  review: {
    id: string
    reviewerName: string
    reviewedName: string
    content: string
    category: string
    timestamp: string
    votesUp: number
    votesDown: number
  }
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const categoryEmojis = {
    professional: '💼',
    marketplace: '🛒',
    dating: '💕',
    social: '🤝',
    general: '🔗'
  }
  
  return (
    <Card>
      <div className="flex space-x-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-2">
          <button className="p-1 rounded-full text-slate-400 hover:text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="text-sm font-medium text-slate-600">
            {review.votesUp - review.votesDown}
          </span>
          
          <button className="p-1 rounded-full text-slate-400 hover:text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Content Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-slate-800">
                {review.reviewerName} → {review.reviewedName}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>{categoryEmojis[review.category]} {review.category}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(review.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <p className="text-slate-700 leading-relaxed">
            {review.content}
          </p>
        </div>
      </div>
    </Card>
  )
}
```

---

## **4. Form Components**

### **4.1 Category Selector**
```typescript
// components/form/CategorySelector.tsx
import React from 'react'
import { clsx } from 'clsx'

interface Category {
  id: string
  label: string
  emoji: string
}

interface CategorySelectorProps {
  categories: Category[]
  selected: string
  onChange: (categoryId: string) => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selected,
  onChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={clsx(
            'p-4 rounded-xl border-2 text-left transition-all',
            selected === category.id
              ? 'border-cyan-500 bg-cyan-50'
              : 'border-slate-200 hover:border-slate-300'
          )}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{category.emoji}</span>
            <span className="font-medium text-slate-800">{category.label}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
```

---

## **5. Usage Examples**

### **5.1 Complete Form Example**
```typescript
// Example: Create Review Form
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { CategorySelector } from '@/components/form/CategorySelector'

const CreateReviewForm = () => {
  const [formData, setFormData] = useState({
    reviewFor: '',
    category: '',
    content: ''
  })

  const categories = [
    { id: 'professional', label: 'Professional', emoji: '💼' },
    { id: 'marketplace', label: 'Marketplace', emoji: '🛒' },
    { id: 'dating', label: 'Dating', emoji: '💕' },
    { id: 'social', label: 'Social', emoji: '🤝' },
    { id: 'general', label: 'General', emoji: '🔗' }
  ]

  return (
    <Card>
      <form className="space-y-6">
        <Input
          label="Who are you reviewing?"
          placeholder="Search for a friend..."
          value={formData.reviewFor}
          onChange={(e) => setFormData({...formData, reviewFor: e.target.value})}
          fullWidth
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            What about?
          </label>
          <CategorySelector
            categories={categories}
            selected={formData.category}
            onChange={(category) => setFormData({...formData, category})}
          />
        </div>

        <Input
          label="Your review"
          placeholder="Share your experience..."
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          maxLength={300}
          fullWidth
        />

        <Button variant="primary" fullWidth>
          Post Review
        </Button>
      </form>
    </Card>
  )
}
```

---

## **6. Styling Guidelines**

### **6.1 Spacing System**
```css
/* Base spacing follows 4px grid */
.space-1 { margin: 0.25rem; }  /* 4px */
.space-2 { margin: 0.5rem; }   /* 8px */
.space-3 { margin: 0.75rem; }  /* 12px */
.space-4 { margin: 1rem; }     /* 16px */
.space-6 { margin: 1.5rem; }   /* 24px */
.space-8 { margin: 2rem; }     /* 32px */
```

### **6.2 Shadow System**
```css
/* Custom shadows for depth */
.shadow-soft {
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 
              0 10px 20px -2px rgba(0, 0, 0, 0.04);
}
```

### **6.3 Animation Guidelines**
```css
/* Consistent transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

---

## **Conclusion**

This component library provides:

✅ **Complete design system** with colors, typography, and spacing
✅ **Core UI components** with consistent styling
✅ **Specialized components** for trust scores and reviews
✅ **Form components** with validation patterns
✅ **Usage examples** showing real implementation
✅ **Styling guidelines** for consistent design

All components follow the exact patterns used in the current ScoopSocials platform and are built with TypeScript and Tailwind CSS.

---

*Component Library Version: 1.0*
*Last Updated: January 2025*
*© 2025 Scoop Technologies LLC* 