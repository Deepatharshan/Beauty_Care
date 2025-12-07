import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken, hashPassword, verifyPassword } from "@/lib/auth"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch global settings (create default if missing)
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      })
    }

    return NextResponse.json({
      user,
      settings: {
        whatsappNumber: settings.whatsappNumber || null,
      },
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }
    const { email, currentPassword, newPassword, whatsappNumber } = await request.json()

    console.log("PUT /api/admin/settings - Received payload:", { email, whatsappNumber, hasPassword: !!currentPassword })

    // Validate input - only require password if changing email or password
    if ((email || newPassword) && !currentPassword) {
      return NextResponse.json({ error: "Current password is required to change email or password" }, { status: 400 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password only if changing email or password
    if ((email || newPassword) && currentPassword) {
      const isValidPassword = await verifyPassword(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }
    }

    // Prepare update data for user
    const updateData: any = {}

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }

      updateData.email = email
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }

      updateData.password = await hashPassword(newPassword)
    }

    // Update user if there are changes
    let updatedUser = null
    if (Object.keys(updateData).length > 0) {
      updatedUser = await prisma.user.update({
        where: { id: payload.userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      })
    } else {
      // Fetch current user minimal if no change
      updatedUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, name: true, email: true, phone: true, role: true },
      })
    }

    // Update Settings (create if missing)
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }
    // Only update provided fields
    const settingsUpdate: any = {}
    if (typeof whatsappNumber !== "undefined") {
      settingsUpdate.whatsappNumber = whatsappNumber || null
    }

    console.log("Settings update object:", settingsUpdate)

    if (Object.keys(settingsUpdate).length > 0) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: settingsUpdate,
      })
      console.log("Settings updated:", settings)
    } else {
      console.log("No settings to update")
    }

    return NextResponse.json({
      user: updatedUser,
      settings: {
        whatsappNumber: settings.whatsappNumber || null,
      },
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
