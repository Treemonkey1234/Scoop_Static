import React from 'react'
import { 
  TrophyIcon, 
  HeartIcon, 
  UserGroupIcon, 
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface StatItem {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface StatsWidgetProps {
  title: string
  stats: StatItem[]
  className?: string
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ title, stats, className = '' }) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return '↗️'
    if (trend === 'down') return '↘️'
    return '→'
  }

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-slate-600'
  }

  return (
    <div className={`card-premium ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <ChartBarIcon className="w-5 h-5 text-slate-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="relative p-4 rounded-xl bg-white/80 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                  {getTrendIcon(stat.trend)} {stat.change}
                </span>
              )}
            </div>
            
            <div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500">
                {stat.label}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-100 transition-opacity duration-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Quick Stats Component for Home Page
export const QuickStats: React.FC = () => {
  const stats = [
    {
      label: 'Trust Scoops',
      value: '92',
      icon: '🍦',
      change: '+3',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Flavor profile score'
    },
    {
      label: 'Sweet Connections',
      value: '234',
      icon: '🍨',
      change: '+12',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Scoop buddies'
    },
    {
      label: 'Flavor Reviews',
      value: '87',
      icon: '🧁',
      change: '+5',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Shared scoops'
    },
    {
      label: 'Ice Cream Socials',
      value: '23',
      icon: '🎉',
      change: '+2',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Events attended'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative p-4 rounded-xl bg-white/80 transition-all duration-200 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 via-transparent to-primary-50/10 opacity-100 transition-opacity duration-200 rounded-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.bgColor} ${stat.color}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-600 mb-1">{stat.label}</div>
            <div className="text-xs text-slate-500">{stat.description}</div>
            
            {/* Ice cream cone progress bar */}
            {stat.label === 'Trust Scoops' && (
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">Legendary</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsWidget 