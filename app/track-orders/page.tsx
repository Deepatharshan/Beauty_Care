"use client"

import { useState } from "react"
import { Search, Package, Clock, CheckCircle, XCircle, Loader } from "lucide-react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  totalPrice: number
  orderType: string
  orderStatus: string
  orderDate: string
  product?: {
    id: string
    name: string
    image: string
    price: number
  }
}

export default function TrackOrdersPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number")
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`/api/orders?phone=${encodeURIComponent(phoneNumber.trim())}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data)
      
      if (data.length === 0) {
        toast.info("No orders found for this phone number")
      } else {
        toast.success(`Found ${data.length} order(s)`)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-500" size={24} />
      case "processing":
        return <Loader className="text-blue-500" size={24} />
      case "completed":
        return <CheckCircle className="text-green-500" size={24} />
      case "cancelled":
        return <XCircle className="text-red-500" size={24} />
      default:
        return <Package className="text-gray-500" size={24} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return "bg-green-50 text-green-700 border-green-200"
      case "instagram":
        return "bg-pink-50 text-pink-700 border-pink-200"
      case "facebook":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <main>
      <Navbar />

      <section className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">Track Your Orders</h1>
            <p className="text-gray-600 text-sm">Enter your phone number to view your order status</p>
          </div>

          <Card className="max-w-2xl mx-auto p-6 bg-white">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gray-900 hover:bg-gray-800 text-white h-12 px-8"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={18} />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2" size={18} />
                    Search
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : searched && orders.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-500 text-sm">We couldn't find any orders for this phone number.</p>
          </Card>
        ) : orders.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-6 text-gray-900">Your Orders ({orders.length})</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">{getStatusIcon(order.orderStatus)}</div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-lg text-gray-900">{order.product?.name || "Product"}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Order ID: {order.id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-light text-gray-900">Rs. {order.totalPrice}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${getChannelColor(
                            order.orderType
                          )}`}
                        >
                          {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-900">Customer:</span> {order.customerName}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Phone:</span> {order.customerPhone}
                        </div>
                        {order.customerEmail && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-900">Email:</span> {order.customerEmail}
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-900">Order Date:</span>{" "}
                          {new Date(order.orderDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {order.orderStatus === "pending" && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Your order is pending. We'll process it soon!
                          </p>
                        </div>
                      )}

                      {order.orderStatus === "processing" && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Great!</strong> Your order is being processed.
                          </p>
                        </div>
                      )}

                      {order.orderStatus === "completed" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Completed!</strong> Thank you for your order.
                          </p>
                        </div>
                      )}

                      {order.orderStatus === "cancelled" && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Cancelled:</strong> This order has been cancelled.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center bg-white">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">Track Your Orders</h2>
            <p className="text-gray-500 text-sm">Enter your phone number above to view your order history.</p>
          </Card>
        )}
      </section>
    </main>
  )
}
