'use client'

const FourPointedStar = ({ 
  className, 
  style,
  gradientId = "star-gradient" 
}: { 
  className?: string
  style?: React.CSSProperties
  gradientId?: string
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="50%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#fdba74" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2 Q13 8 14.5 9.5 Q16 11 22 12 Q16 13 14.5 14.5 Q13 16 12 22 Q11 16 9.5 14.5 Q8 13 2 12 Q8 11 9.5 9.5 Q11 8 12 2 Z" 
      fill={`url(#${gradientId})`}
      strokeLinejoin="round"
    />
  </svg>
)

export default function AppIconPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-0 m-0">
      {/* App Icon Container - 1024x1024 equivalent */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: '100vmin',
          height: '100vmin',
          maxWidth: '1024px',
          maxHeight: '1024px',
        }}
      >
        {/* Background with rounded corners for app icon */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-[22.5%]"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        />
        
        {/* Star Icon - Centered and Large */}
        <div className="relative z-10">
          <FourPointedStar 
            className="text-transparent"
            style={{
              width: '60vmin',
              height: '60vmin',
              maxWidth: '614px',
              maxHeight: '614px',
              filter: 'drop-shadow(0 10px 30px rgba(251, 146, 60, 0.5))',
            }}
            gradientId="app-icon-gradient"
          />
        </div>
      </div>
      
      {/* Instructions */}
      <div className="fixed bottom-8 left-0 right-0 text-center">
        <p className="text-white text-sm opacity-75">
          Screenshot this page for your app icon
        </p>
        <p className="text-white text-xs opacity-50 mt-1">
          Recommended: 1024x1024px for app stores
        </p>
      </div>
    </div>
  )
}
