import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Check if admin already exists
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@glowing.com" },
    })

    if (adminExists) {
      return NextResponse.json(
        { error: "Admin user already exists", user: adminExists },
        { status: 400 }
      )
    }

    // Hash the admin password
    const hashedPassword = await hashPassword("admin123")

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@glowing.com",
        phone: "0000000000",
        password: hashedPassword,
        role: "admin",
      },
    })

    // Generate token for immediate login
    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    })

    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        role: adminUser.role,
      },
      token,
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Setup failed", details: String(error) },
      { status: 500 }
    )
  }
}
