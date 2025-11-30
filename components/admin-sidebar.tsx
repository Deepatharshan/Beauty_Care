"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, MessageSquare, ShoppingCart, Users, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl font-light tracking-[0.2em] text-white">GLOWING</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <BarChart3 size={20} />
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/products") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Package size={20} />
          Products
        </Link>

        <Link
          href="/admin/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/orders") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <ShoppingCart size={20} />
          Orders
        </Link>

        <Link
          href="/admin/reviews"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/reviews") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <MessageSquare size={20} />
          Reviews
        </Link>

        <Link
          href="/admin/users"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/users") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Users size={20} />
          Users
        </Link>

        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/settings") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition mb-2"
        >
          Back to Store
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
