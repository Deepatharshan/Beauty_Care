import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get("phone")

    const where = phone ? { customerPhone: phone } : {}

    const orders = await prisma.order.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    console.log("=== ORDER API CALLED ===")
    const body = await req.json()
    console.log("Received order data:", JSON.stringify(body, null, 2))
    
    const { productId, customerName, customerPhone, customerEmail, totalPrice, orderType, quantity } = body

    // Validation
    if (!productId || !customerName || !customerPhone || totalPrice === undefined || totalPrice === null || !orderType) {
      console.error("Validation failed - Missing fields:", { 
        productId: !!productId, 
        customerName: !!customerName, 
        customerPhone: !!customerPhone, 
        totalPrice: totalPrice !== undefined && totalPrice !== null, 
        orderType: !!orderType 
      })
      return NextResponse.json({ 
        error: "Missing required fields",
        details: { productId: !!productId, customerName: !!customerName, customerPhone: !!customerPhone, totalPrice: totalPrice !== undefined && totalPrice !== null, orderType: !!orderType }
      }, { status: 400 })
    }

    // Verify product exists
    console.log("Checking if product exists:", productId)
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      console.error("Product not found:", productId)
      return NextResponse.json({ error: "Product not found", productId }, { status: 404 })
    }
    console.log("Product found:", product.name)

    // Ensure totalPrice is a number
    const priceValue = typeof totalPrice === 'number' ? totalPrice : Number.parseFloat(String(totalPrice))
    
    if (isNaN(priceValue) || priceValue <= 0) {
      console.error("Invalid price value:", totalPrice, "->", priceValue)
      return NextResponse.json({ error: "Invalid price value", received: totalPrice, parsed: priceValue }, { status: 400 })
    }

    console.log("Creating order with data:", {
      productId,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : null,
      totalPrice: priceValue,
      orderType: String(orderType).toLowerCase(),
    })

    const order = await prisma.order.create({
      data: {
        productId,
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        customerEmail: customerEmail ? String(customerEmail).trim() : null,
        totalPrice: priceValue,
        orderType: String(orderType).toLowerCase(),
      },
    })

    console.log("Order created successfully:", order.id)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("=== ERROR CREATING ORDER ===")
    console.error("Error type:", error?.constructor?.name)
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    console.error("Full error:", error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorName = error instanceof Error ? error.name : "UnknownError"
    
    return NextResponse.json({ 
      error: "Failed to create order",
      message: errorMessage,
      name: errorName,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
