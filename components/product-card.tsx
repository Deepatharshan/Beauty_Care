"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  price: number
  image: string
  reviews?: any[]
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  // Calculate average rating
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : 0

  const reviewCount = product.reviews?.length || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-[#d4549b] transition line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.round(averageRating as any) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {averageRating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-[#d4549b]">Rs. {product.price}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex-1 bg-[#d4549b] hover:bg-[#c1408a] text-white"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
