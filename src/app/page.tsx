import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">AstroMatch</h1>
        <Link href="/app" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium">
          Get Started
        </Link>
      </div>
    </div>
  )
}
