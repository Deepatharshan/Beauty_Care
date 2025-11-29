import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Admin routes - just check if token exists and is valid
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url))
    }
    
    // Check if user is admin
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url))
    }
  }

  // Cart page - check authentication
  if (pathname === "/cart") {
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/cart", request.url))
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protected API routes
  if (pathname.startsWith("/api/orders") && request.method === "POST") {
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
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
