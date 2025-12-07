import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// Prevent static generation for this API route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Fetch all data
    const orders = await prisma.order.findMany()
    const products = await prisma.product.findMany()
    const reviews = await prisma.review.findMany()

    // Calculate totals
    const totalOrders = orders.length
    // Calculate revenue only from completed orders
    const totalRevenue = orders
      .filter((order) => order.orderStatus === "completed")
      .reduce((sum, order) => sum + order.totalPrice, 0)
    const totalProducts = products.length
    const totalReviews = reviews.length

    // Orders by channel
    const ordersByChannel = [
      {
        name: "WhatsApp",
        value: orders.filter((o) => o.orderType === "whatsapp").length,
      },
      {
        name: "Instagram",
        value: orders.filter((o) => o.orderType === "instagram").length,
      },
      {
        name: "Facebook",
        value: orders.filter((o) => o.orderType === "facebook").length,
      },
    ]

    // Daily revenue (last 7 days)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayRevenue = orders
        .filter((o) => o.orderDate.toISOString().split("T")[0] === dateStr && o.orderStatus === "completed")
        .reduce((sum, o) => sum + o.totalPrice, 0)

      last7Days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: dayRevenue,
      })
    }

    // Orders by status
    const ordersByStatus = [
      {
        name: "Pending",
        value: orders.filter((o) => o.orderStatus === "pending").length,
      },
      {
        name: "Processing",
        value: orders.filter((o) => o.orderStatus === "processing").length,
      },
      {
        name: "Completed",
        value: orders.filter((o) => o.orderStatus === "completed").length,
      },
      {
        name: "Cancelled",
        value: orders.filter((o) => o.orderStatus === "cancelled").length,
      },
    ]

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalReviews,
      ordersByChannel,
      dailyRevenue: last7Days,
      ordersByStatus,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
