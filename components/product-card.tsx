"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  image: string
  reviews?: any[]
  discount?: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  // Calculate average rating
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : 0

  const reviewCount = product.reviews?.length || 0
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image,
      quantity: 1,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discount && product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-gray-100 text-gray-900 hover:bg-gray-100 font-medium">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(Number(averageRating))
                    ? "fill-gray-900 text-gray-900"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            Rs. {discountedPrice.toFixed(2)}
          </span>
          {product.discount && product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-2"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
