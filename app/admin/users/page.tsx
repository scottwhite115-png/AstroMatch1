// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { requireStaff } from "@/lib/auth-helpers"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { q?: string; role?: string; status?: string }
}) {
  const admin = await requireStaff()

  const q = (searchParams?.q ?? "").trim()
  const roleFilter = searchParams?.role as "USER" | "ADMIN" | "OWNER" | undefined
  const statusFilter = searchParams?.status as
    | "ACTIVE"
    | "SUSPENDED"
    | "BANNED"
    | undefined

  const where: any = {}

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { display_name: { contains: q, mode: "insensitive" } },
    ]
  }

  if (roleFilter) {
    where.role = roleFilter
  }

  if (statusFilter) {
    where.status = statusFilter
  }

  const profiles = await prisma.profiles.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Signed in as {admin.email} · {admin.role}
          </p>
        </div>

        {/* Back to Dashboard */}
        <div>
          <Link
            href="/admin"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <form className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Email or name..."
                className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                defaultValue={roleFilter ?? ""}
                className="rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={statusFilter ?? ""}
                className="rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="BANNED">Banned</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-md bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {profiles.length} user{profiles.length !== 1 ? "s" : ""}
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Signs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {p.photo_url ? (
                          <img
                            src={p.photo_url}
                            alt={p.display_name || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                            {p.display_name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {p.display_name || "Unnamed User"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {p.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {p.east_west_code && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 w-fit">
                            {p.east_west_code}
                          </span>
                        )}
                        {p.chinese_sign && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {p.chinese_sign}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.role === "OWNER"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : p.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.status === "ACTIVE" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      )}
                      {p.status === "SUSPENDED" && (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 w-fit">
                            Suspended
                          </span>
                          {p.suspensionEndsAt && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Until {new Date(p.suspensionEndsAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                      {p.status === "BANNED" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Banned
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/users/${p.id}`}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 font-medium"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}

                {profiles.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <p className="font-medium">No users found</p>
                        <p className="text-xs">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {profiles.length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {profiles.filter((p) => p.status === "ACTIVE").length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Suspended</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {profiles.filter((p) => p.status === "SUSPENDED").length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Banned</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {profiles.filter((p) => p.status === "BANNED").length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
