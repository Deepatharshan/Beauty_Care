"use client"

import Link from "next/link"
import { Menu, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#d4549b] to-[#f5a9d0] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="font-bold text-xl text-[#1a1a1a] hidden md:inline">BeautyCore</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-[#d4549b] transition">
            Home
          </Link>
          <Link href="/track-orders" className="text-gray-600 hover:text-[#d4549b] transition">
            Track Orders
          </Link>
          <Link href="/admin" className="text-gray-600 hover:text-[#d4549b] transition">
            Admin
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4549b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-50">
            Home
          </Link>
          <Link href="/cart" className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-[#d4549b] text-white text-xs rounded-full px-2 py-1 font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/track-orders" className="block px-4 py-2 hover:bg-gray-50">
            Track Orders
          </Link>
          <Link href="/admin" className="block px-4 py-2 hover:bg-gray-50">
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}
