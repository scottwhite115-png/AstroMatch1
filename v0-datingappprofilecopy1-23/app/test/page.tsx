'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg viewBox="0 0 24 24" className="w-16 h-16" style={{ fill: "#fbbf24" }}>
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </div>
        <h1 className="font-bold text-4xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
          AstroMatch
        </h1>
        <p className="text-white/80 text-xl mb-2">✅ Mobile is working!</p>
        <p className="text-white/60 text-sm mb-8">
          If you can see this, your connection is good.
        </p>
        
        <div className="space-y-4">
          <a 
            href="/matches"
            className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-lg"
          >
            Go to Matches
          </a>
          
          <a 
            href="/profile/profile"
            className="block w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20"
          >
            View Profile
          </a>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/60 text-xs mb-2">Device Info:</p>
          <p className="text-white/80 text-sm font-mono">
            {typeof window !== 'undefined' ? window.navigator.userAgent.includes('Mobile') ? '📱 Mobile Device' : '💻 Desktop Device' : 'Loading...'}
          </p>
          <p className="text-white/80 text-sm font-mono mt-1">
            Screen: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  )
}


