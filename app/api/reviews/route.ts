import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, rating, content, image } = body

    if (!productId || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating: Number.parseInt(rating),
        content,
        image: image || null,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
