"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, MessageSquare, ShoppingCart, LogOut } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#d4549b] to-[#f5a9d0] rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">B</span>
          </div>
          <span className="font-bold text-xl">BeautyCore</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin") ? "bg-[#d4549b] text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <BarChart3 size={20} />
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/products") ? "bg-[#d4549b] text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Package size={20} />
          Products
        </Link>

        <Link
          href="/admin/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/orders") ? "bg-[#d4549b] text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <ShoppingCart size={20} />
          Orders
        </Link>

        <Link
          href="/admin/reviews"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive("/admin/reviews") ? "bg-[#d4549b] text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <MessageSquare size={20} />
          Reviews
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
        >
          <LogOut size={20} />
          Back to Store
        </Link>
      </div>
    </aside>
  )
}
