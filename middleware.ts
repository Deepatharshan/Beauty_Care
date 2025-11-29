import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Middleware is now minimal - most auth checks are page-level
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
