"use client"

import { useState, useEffect } from "react"
import { Star, Trash2, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/admin-sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Review {
  id: string
  content: string
  rating: number
  image?: string
  createdAt: string
  product?: { name: string; id: string }
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      const data = await response.json()
      setReviews(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId))
        toast.success("Review deleted successfully")
      } else {
        toast.error("Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Failed to delete review")
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4) return "text-blue-600"
    if (rating >= 3) return "text-yellow-600"
    if (rating >= 2) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Reviews</h1>
            <p className="text-gray-600 mt-2">Manage customer reviews and ratings</p>
          </div>

          <Card>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4549b]"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No reviews found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <p className="font-semibold text-gray-900">{review.product?.name || "Unknown Product"}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className={`font-bold ${getRatingColor(review.rating)}`}>{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-700 line-clamp-2">{review.content}</p>
                      </TableCell>
                      <TableCell>
                        {review.image ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Review Image</DialogTitle>
                              </DialogHeader>
                              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={review.image || "/placeholder.svg"}
                                  alt="Review"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-gray-400 text-sm">No image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
