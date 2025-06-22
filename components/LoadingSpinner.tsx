import React from 'react'

interface LoadingSpinnerProps {
  type?: 'default' | 'pull-refresh'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ type = 'default' }) => {
  
  // Simple ice cream cone animation for pull-to-refresh
  if (type === 'pull-refresh') {
    return (
      <div className="flex items-center justify-center space-x-3 py-6">
        <div className="animate-bounce" style={{ animationDelay: '0ms' }}>
          <div className="text-3xl">🍦</div>
        </div>
        <div className="animate-bounce" style={{ animationDelay: '200ms' }}>
          <div className="text-3xl">🍨</div>
        </div>
        <div className="animate-bounce" style={{ animationDelay: '400ms' }}>
          <div className="text-3xl">🍧</div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="ice-cream-svg-loader">
        <svg 
          width="80" 
          height="140" 
          viewBox="0 0 80 140" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="animate-bounce-gentle"
        >
          {/* Waffle Cone */}
          <defs>
            <pattern id="wafflePattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#D2691E"/>
              <path d="M0,8 L8,0 M-2,2 L2,-2 M6,10 L10,6" stroke="#8B4513" strokeWidth="1"/>
            </pattern>
            
            {/* Gradients for scoops */}
            <linearGradient id="strawberryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1"/>
              <stop offset="100%" stopColor="#FF69B4"/>
            </linearGradient>
            
            <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#98FB98"/>
              <stop offset="100%" stopColor="#32CD32"/>
            </linearGradient>
            
            <linearGradient id="vanillaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC"/>
              <stop offset="100%" stopColor="#F0E68C"/>
            </linearGradient>
            
            <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2691E"/>
              <stop offset="100%" stopColor="#8B4513"/>
            </linearGradient>
          </defs>
          
          {/* Waffle Cone - Static */}
          <path 
            d="M25 70 L40 130 L55 70 Z" 
            fill="url(#wafflePattern)"
            stroke="#8B4513"
            strokeWidth="1"
          />
          
          {/* Cone Waffle Lines */}
          <g stroke="#8B4513" strokeWidth="0.5" opacity="0.7">
            <line x1="27" y1="75" x2="53" y2="75"/>
            <line x1="29" y1="85" x2="51" y2="85"/>
            <line x1="31" y1="95" x2="49" y2="95"/>
            <line x1="33" y1="105" x2="47" y2="105"/>
            <line x1="35" y1="115" x2="45" y2="115"/>
            <line x1="37" y1="125" x2="43" y2="125"/>
            
            <line x1="30" y1="72" x2="38" y2="128"/>
            <line x1="35" y1="70" x2="40" y2="130"/>
            <line x1="40" y1="70" x2="40" y2="130"/>
            <line x1="45" y1="70" x2="42" y2="128"/>
            <line x1="50" y1="72" x2="42" y2="128"/>
          </g>
          
          {/* Vanilla Scoop (bottom) - Animated filling */}
          <circle 
            cx="40" 
            cy="65" 
            fill="url(#vanillaGrad)"
            stroke="#F0E68C"
            strokeWidth="1"
          >
            <animate 
              attributeName="r" 
              values="0;18;18;18;18;0;0;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0;1;1;1;1;0;0;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Mint Scoop (middle) - Animated filling */}
          <circle 
            cx="40" 
            cy="45" 
            fill="url(#mintGrad)"
            stroke="#32CD32"
            strokeWidth="1"
          >
            <animate 
              attributeName="r" 
              values="0;0;17;17;17;17;0;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0;0;1;1;1;1;0;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Strawberry Scoop (top) - Animated filling */}
          <circle 
            cx="40" 
            cy="27" 
            fill="url(#strawberryGrad)"
            stroke="#FF69B4"
            strokeWidth="1"
          >
            <animate 
              attributeName="r" 
              values="0;0;0;16;16;16;16;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0;0;0;1;1;1;1;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Cherry on top - Animated */}
          <circle 
            cx="40" 
            cy="15" 
            r="3" 
            fill="#DC143C"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;1;1;1;1;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0;0;0;0;1;1;1;1;0;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Cherry stem - Animated */}
          <path 
            d="M40 15 Q42 10 45 8" 
            stroke="#228B22" 
            strokeWidth="1.5" 
            fill="none"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;1;1;1;1;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </path>
          
          {/* Sprinkles - Animated to appear with scoops */}
          <g>
            <rect x="35" y="30" width="2" height="6" fill="#FF1493" rx="1" transform="rotate(20 36 33)">
              <animate 
                attributeName="opacity" 
                values="0;0;0;1;1;1;1;0;0;0" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </rect>
            <rect x="45" y="35" width="2" height="6" fill="#00CED1" rx="1" transform="rotate(-30 46 38)">
              <animate 
                attributeName="opacity" 
                values="0;0;1;1;1;1;0;0;0;0" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </rect>
            <rect x="32" y="50" width="2" height="6" fill="#FFD700" rx="1" transform="rotate(45 33 53)">
              <animate 
                attributeName="opacity" 
                values="0;1;1;1;1;0;0;0;0;0" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </rect>
            <rect x="48" y="55" width="2" height="6" fill="#9370DB" rx="1" transform="rotate(-15 49 58)">
              <animate 
                attributeName="opacity" 
                values="0;1;1;1;1;0;0;0;0;0" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </rect>
            <rect x="38" y="40" width="2" height="6" fill="#FF4500" rx="1" transform="rotate(60 39 43)">
              <animate 
                attributeName="opacity" 
                values="0;0;1;1;1;1;0;0;0;0" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </rect>
          </g>
          
          {/* Shine effects - Animated with scoops */}
          <ellipse cx="35" cy="22" rx="3" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-20 35 22)">
            <animate 
              attributeName="opacity" 
              values="0;0;0;0.3;0.3;0.3;0.3;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="45" cy="40" rx="2" ry="4" fill="rgba(255,255,255,0.2)" transform="rotate(15 45 40)">
            <animate 
              attributeName="opacity" 
              values="0;0;0.2;0.2;0.2;0.2;0;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="35" cy="60" rx="2" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(-10 35 60)">
            <animate 
              attributeName="opacity" 
              values="0;0.25;0.25;0.25;0.25;0;0;0;0;0" 
              dur="4s" 
              repeatCount="indefinite"
            />
          </ellipse>
        </svg>
      </div>
      <p className="mt-6 text-lg font-medium text-cyan-600 animate-pulse">
        Scooping up something sweet...
      </p>
    </div>
  )
}

export default LoadingSpinner 