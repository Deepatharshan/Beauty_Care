"use client"

import { Star, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

interface Review {
  id: string
  content: string
  rating: number
  image?: string
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
  productId: string
  onReviewAdded: () => void
}

export default function ReviewList({ reviews, productId, onReviewAdded }: ReviewListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    setDeletingId(reviewId)
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onReviewAdded()
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("Failed to delete review")
    } finally {
      setDeletingId(null)
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Customer Reviews</h3>
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteReview(review.id)}
              disabled={deletingId === review.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          {review.image && (
            <div className="relative w-32 h-32 mb-3 rounded-lg overflow-hidden">
              <Image src={review.image || "/placeholder.svg"} alt="Review image" fill className="object-cover" />
            </div>
          )}

          <p className="text-gray-700 mb-2">{review.content}</p>

          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </Card>
      ))}
    </div>
  )
}
