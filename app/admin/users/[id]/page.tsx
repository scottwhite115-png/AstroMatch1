// app/admin/users/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import { requireStaff, getCurrentProfileWithRole } from "@/lib/auth-helpers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { UserAdminControls } from "@/components/admin/UserAdminControls"

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  await requireStaff() // only ADMIN/OWNER allowed into /admin
  const { id } = await params

  const [target, acting] = await Promise.all([
    prisma.profiles.findUnique({
      where: { id },
    }),
    getCurrentProfileWithRole(),
  ])

  if (!target) {
    notFound()
  }

  if (!acting) {
    // Shouldn't happen because requireStaff already checked, but just in case
    notFound()
  }

  const canChangeRole = acting.role === "OWNER" && target.id !== acting.id

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            {target.photo_url ? (
              <img
                src={target.photo_url}
                alt={target.display_name || "User"}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                {target.display_name?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {target.display_name || "Unnamed User"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {target.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                ID: {target.id}
              </p>
            </div>
          </div>

          <Link
            href="/admin/users"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline whitespace-nowrap"
          >
            ← Back to users
          </Link>
        </div>

        {/* Warning for own account */}
        {target.id === acting.id && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  This is your account
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  You cannot modify your own account status or role.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    target.role === "OWNER"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : target.role === "ADMIN"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {target.role}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    target.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : target.status === "SUSPENDED"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {target.status}
                </span>
              </div>

              {target.east_west_code && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Signs</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {target.east_west_code}
                  </span>
                </div>
              )}

              {target.chinese_sign && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Chinese Sign</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {target.chinese_sign}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Joined</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {target.created_at
                    ? new Date(target.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              {target.status === "SUSPENDED" && target.suspensionEndsAt && (
                <div className="flex justify-between items-center py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                  <span className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                    Suspended Until
                  </span>
                  <span className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                    {new Date(target.suspensionEndsAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}

              {target.isStaff && (
                <div className="flex items-center gap-2 py-2">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Staff Member
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Controls
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Use carefully. 1-week bans block posting and messaging and auto-lift after
                expiry. Permanent bans block the account entirely.
              </p>
            </div>

            <UserAdminControls
              targetUserId={target.id}
              targetName={target.display_name || "this user"}
              currentRole={target.role}
              currentStatus={target.status}
              canChangeRole={canChangeRole}
              isOwnAccount={target.id === acting.id}
            />
          </div>
        </div>

        {/* Additional Profile Details */}
        {(target.bio || target.city || target.occupation) && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {target.city && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">{target.city}</p>
                </div>
              )}

              {target.occupation && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Occupation
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">{target.occupation}</p>
                </div>
              )}

              {target.bio && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Bio
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {target.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

