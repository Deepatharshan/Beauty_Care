import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

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
    "/cart",
    "/api/orders/:path*",
  ],
}
