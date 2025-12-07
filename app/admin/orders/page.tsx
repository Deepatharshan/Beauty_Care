"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/admin-sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShoppingBag, Package, Printer, FileDown, Search, X } from "lucide-react"
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
  productId: string
  quantity: number
  product?: { name: string }
}

interface ProductOrderCount {
  productId: string
  productName: string
  count: number
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [productCounts, setProductCounts] = useState<ProductOrderCount[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search query
    if (!searchQuery.trim()) {
      setFilteredOrders(orders)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.toLowerCase().includes(query) ||
        order.customerEmail?.toLowerCase().includes(query) ||
        order.product?.name.toLowerCase().includes(query) ||
        order.totalPrice.toString().includes(query)
      )
    })
    setFilteredOrders(filtered)
  }, [searchQuery, orders])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data)
      
      // Calculate product order counts
      const counts: { [key: string]: { name: string; count: number } } = {}
      data.forEach((order: Order) => {
        const key = order.productId
        if (!counts[key]) {
          counts[key] = { name: order.product?.name || "Unknown", count: 0 }
        }
        counts[key].count += order.quantity
      })
      
      const productCountArray = Object.entries(counts).map(([productId, data]) => ({
        productId,
        productName: data.name,
        count: data.count,
      }))
      
      setProductCounts(productCountArray.sort((a, b) => b.count - a.count))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      })

      if (response.ok) {
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, orderStatus: newStatus } : order)))
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return "bg-green-100 text-green-800"
      case "instagram":
        return "bg-pink-100 text-pink-800"
      case "facebook":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generateBillHTML = (order: Order) => {
    const orderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Order Bill - ${order.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #ffffff;
              padding: 30px;
              color: #333;
            }
            
            .container {
              max-width: 900px;
              margin: 0 auto;
              background-color: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #333;
              padding-bottom: 15px;
            }
            
            .header h1 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #1a1a1a;
            }
            
            .header p {
              font-size: 14px;
              color: #666;
              margin: 3px 0;
            }
            
            .section {
              margin-bottom: 30px;
            }
            
            .section-title {
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              color: #1a1a1a;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #ddd;
            }
            
            .info-row {
              display: table;
              width: 100%;
              margin-bottom: 10px;
            }
            
            .info-label {
              display: table-cell;
              font-weight: bold;
              width: 30%;
              color: #1a1a1a;
              font-size: 13px;
            }
            
            .info-value {
              display: table-cell;
              color: #444;
              font-size: 13px;
              padding-left: 20px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            
            thead {
              background-color: #f5f5f5;
            }
            
            th {
              padding: 10px;
              text-align: left;
              font-weight: bold;
              font-size: 12px;
              color: #1a1a1a;
              border-bottom: 2px solid #333;
              text-transform: uppercase;
            }
            
            td {
              padding: 12px 10px;
              font-size: 13px;
              color: #333;
              border-bottom: 1px solid #ddd;
            }
            
            .total-section {
              margin-top: 30px;
              text-align: right;
            }
            
            .total-row {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .total-amount {
              font-weight: bold;
              color: #1a1a1a;
              font-size: 18px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid #333;
              display: flex;
              justify-content: flex-end;
              gap: 20px;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
            
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 3px;
              font-size: 11px;
              font-weight: bold;
              background-color: #f0f0f0;
              color: #333;
            }
            
            @media print {
              body {
                background-color: white;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>ORDER BILL</h1>
              <p>Order #${order.id}</p>
            </div>

            <!-- Customer & Order Info -->
            <div style="display: table; width: 100%; margin-bottom: 30px;">
              <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 20px;">
                <div class="section-title">Customer Information</div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${order.customerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${order.customerPhone}</span>
                </div>
                ${order.customerEmail ? `
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${order.customerEmail}</span>
                </div>
                ` : ""}
              </div>

              <div style="display: table-cell; width: 50%; vertical-align: top;">
                <div class="section-title">Order Information</div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${orderDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Channel:</span>
                  <span class="info-value">${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value"><span class="status">${order.orderStatus.toUpperCase()}</span></span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="section">
              <div class="section-title">Order Items</div>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left;">Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${order.product?.name || "Unknown Product"}</td>
                    <td style="text-align: center;">${order.quantity}</td>
                    <td style="text-align: right;"><strong>Rs. ${order.totalPrice.toLocaleString()}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total -->
            <div class="total-section">
              <div class="total-amount">
                <span>Total Amount:</span>
                <span>Rs. ${order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Thank you for your order!</p>
              <p>Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handlePrintBill = (order: Order) => {
    const billHTML = generateBillHTML(order)
    const printWindow = window.open("", "", "width=800,height=600")
    if (printWindow) {
      printWindow.document.write(billHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownloadPDF = (order: Order) => {
    try {
      const billHTML = generateBillHTML(order)
      
      // Create a blob from the HTML
      const blob = new Blob([billHTML], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      
      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `order-${order.id}-bill.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
      
      toast.success("Bill downloaded as HTML. You can open it in a browser and print to PDF.")
    } catch (error) {
      console.error("Error downloading bill:", error)
      toast.error("Failed to download bill")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-wide">Orders</h1>
            <p className="text-gray-500 mt-2 text-sm">View and manage customer orders</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by order ID, customer name, phone, email, product, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Found {filteredOrders.length} result{filteredOrders.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Product Order Counts */}
          {productCounts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {productCounts.map((product) => (
                  <Card key={product.productId} className="p-4 bg-white border border-gray-200 hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Product</p>
                        <p className="font-medium text-gray-900 text-sm line-clamp-2">{product.productName}</p>
                      </div>
                      <Package className="text-gray-400 flex-shrink-0" size={20} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                      <p className="text-2xl font-light text-gray-900">{product.count}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Orders Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-12 text-gray-500 bg-white">
              <ShoppingBag size={40} className="mx-auto mb-4 text-gray-300" />
              <p>No orders found</p>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="text-center py-12 text-gray-500 bg-white">
              <ShoppingBag size={40} className="mx-auto mb-4 text-gray-300" />
              <p>No orders match your search</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="p-6 bg-white border border-gray-200 hover:shadow-lg transition">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-start">
                    {/* Customer Info */}
                    <div className="lg:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      {order.customerEmail && (
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      )}
                    </div>

                    {/* Product & Quantity */}
                    <div className="lg:col-span-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Product</p>
                      <p className="font-medium text-gray-900">{order.product?.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                    </div>

                    {/* Amount */}
                    <div className="lg:col-span-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Amount</p>
                      <p className="font-semibold text-gray-900 text-lg">Rs. {order.totalPrice.toLocaleString()}</p>
                    </div>

                    {/* Channel & Date */}
                    <div className="lg:col-span-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Channel</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getChannelColor(order.orderType)}`}
                        >
                          {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status</p>
                      <Select
                        value={order.orderStatus}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-full border-0 p-0 h-auto bg-transparent hover:bg-gray-50">
                          <SelectValue>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Bill Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handlePrintBill(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Print Bill"
                    >
                      <Printer size={20} />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(order)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Download PDF"
                    >
                      <FileDown size={20} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
