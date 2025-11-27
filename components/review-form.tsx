"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Star, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { toast } from "sonner"

interface ReviewFormProps {
  productId: string
  onClose: () => void
  onReviewAdded: () => void
}

export default function ReviewForm({ productId, onClose, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error("Please write a review")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          content,
          image,
        }),
      })

      if (response.ok) {
        toast.success("Review submitted successfully!")
        onReviewAdded()
        onClose()
      } else {
        toast.error("Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Write a Review</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition"
                  >
                    <Star
                      size={32}
                      className={star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Very Good"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Your Review</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-32"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Add a Photo (Optional)</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#d4549b] transition text-center cursor-pointer w-full"
              >
                {image ? (
                  <div className="relative w-full h-32 mx-auto">
                    <Image src={image || "/placeholder.svg"} alt="Review image" fill className="object-contain" />
                  </div>
                ) : (
                  <div>
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                  </div>
                )}
              </button>
              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end">
              <Button type="button" onClick={onClose} variant="outline" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#d4549b] hover:bg-[#c1408a] text-white" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
