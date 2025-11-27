"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft, Star, MessageCircle, ShoppingBag, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import ReviewForm from "@/components/review-form"
import ReviewList from "@/components/review-list"
import RatingBadge from "@/components/rating-badge"
import SocialOrderButtons from "@/components/social-order-buttons"
import { useCart } from "@/lib/cart-context"

interface Review {
  id: string
  content: string
  rating: number
  image?: string
  createdAt: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  reviews?: Review[]
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      setProduct(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch product:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4549b]"></div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-gray-500">Product not found</p>
        </div>
      </main>
    )
  }

  const reviews = product.reviews || []
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0

  return (
    <main>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[#d4549b] hover:text-[#c1408a]">
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Detail Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image 
                src={product.image || "/placeholder.svg"} 
                alt={product.name || "Product image"} 
                fill 
                className="object-cover" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-[#f5a9d0] text-[#1a1a1a] text-sm font-semibold rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">{product.name}</h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.round(averageRating as any) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <RatingBadge rating={Number.parseFloat(averageRating as string)} />
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-5xl font-bold text-[#d4549b]">Rs. {product.price}</span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 font-semibold"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Button
                size="lg"
                onClick={() => {
                  addToCart(
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    },
                    quantity
                  )
                }}
                className="w-full bg-[#d4549b] hover:bg-[#c1408a] text-white"
              >
                <Plus className="mr-2" size={20} />
                Add to Cart
              </Button>
            </div>

            {/* Social Order Buttons */}
            <SocialOrderButtons product={product} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Stats */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 text-[#1a1a1a]">Review Summary</h3>

              <div className="space-y-4">
                <div className="text-center pb-6 border-b">
                  <div className="text-4xl font-bold text-[#d4549b]">{averageRating}</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(averageRating as any) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Based on {reviews.length} reviews</p>
                </div>

                {/* Rating Distribution */}
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm font-semibold w-8">{rating}</span>
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>

              <Button
                onClick={() => setShowReviewForm(true)}
                className="w-full mt-6 bg-[#d4549b] hover:bg-[#c1408a] text-white"
              >
                <MessageCircle size={18} className="mr-2" />
                Write a Review
              </Button>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <ReviewList reviews={reviews} productId={product.id} onReviewAdded={fetchProduct} />
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={product.id}
          onClose={() => setShowReviewForm(false)}
          onReviewAdded={() => {
            setShowReviewForm(false)
            fetchProduct()
          }}
        />
      )}
    </main>
  )
}
