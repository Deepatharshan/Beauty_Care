import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/", "/product"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin")

  // API routes that need protection
  const isProtectedApiRoute = pathname.startsWith("/api/orders") && request.method === "POST"

  // If accessing admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url))
    }
  }

  // If accessing cart or trying to place orders
  if (pathname === "/cart" || isProtectedApiRoute) {
    if (!token) {
      if (pathname === "/cart") {
        return NextResponse.redirect(new URL("/login?redirect=/cart", request.url))
      }
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      if (pathname === "/cart") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart",
    "/api/orders/:path*",
  ],
}
