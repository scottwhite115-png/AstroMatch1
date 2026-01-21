"use client"

export default function TestMatches() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Test Matches Page</h1>
        <p className="text-white/70">If you can see this, the basic app is working!</p>
        <a href="/matches" className="text-blue-400 hover:text-blue-300 mt-4 block">
          Go to Matches Page
        </a>
      </div>
    </div>
  )
}
