"use client"

import Link from "next/link"
import { Menu, ShoppingCart, Search, User, Heart, LogOut } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getCartCount } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
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
            
            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-50 rounded-full transition hidden md:block">
                    <User className="w-5 h-5 text-gray-700" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/track-orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="sm" className="text-gray-700">
                  Login
                </Button>
              </Link>
            )}

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
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-xs text-gray-500">{user?.name}</div>
                {user?.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    ADMIN
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
