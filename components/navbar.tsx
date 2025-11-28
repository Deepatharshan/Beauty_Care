"use client"

import Link from "next/link"
import { Menu, ShoppingCart, Search, User, Heart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition">
              HOME
            </Link>
            <Link href="/admin/products" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
              SHOP
            </Link>
            <Link href="/track-orders" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
              TRACK
            </Link>
            <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
              ADMIN
            </Link>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
            <span className="text-2xl font-light tracking-[0.2em] text-gray-900">GLOWING</span>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-50 rounded-full transition hidden md:block">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-full transition hidden md:block">
              <User className="w-5 h-5 text-gray-700" />
            </button>
            <Link href="/track-orders" className="p-2 hover:bg-gray-50 rounded-full transition hidden md:block">
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-full transition relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 hover:bg-gray-50 rounded-full transition md:hidden"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg">
              HOME
            </Link>
            <Link href="/admin/products" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              SHOP
            </Link>
            <Link href="/track-orders" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              TRACK ORDERS
            </Link>
            <Link href="/admin" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              ADMIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
