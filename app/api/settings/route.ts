import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: {} })
    }

    return NextResponse.json({
      whatsappNumber: settings.whatsappNumber || null,
      whatsappTemplate: settings.whatsappTemplate || null,
    })
  } catch (error) {
    console.error("Error fetching public settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}
