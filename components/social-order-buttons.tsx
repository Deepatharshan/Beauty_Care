"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Instagram, Facebook, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
}

interface SocialOrderButtonsProps {
  product: Product
  initialQuantity?: number
}

export default function SocialOrderButtons({ product, initialQuantity = 1 }: SocialOrderButtonsProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null)

  // Fetch public settings (WhatsApp link)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          setWhatsappLink(data.whatsappLink || null)
        }
      } catch (e) {
        // silently ignore
      }
    }
    loadSettings()
  }, [])

  const totalPrice = product.price * quantity

  const generateOrderMessage = () => {
    return `Hello! I'm interested in ordering: ${product.name} (Qty: ${quantity}) - Total: Rs. ${totalPrice}. Customer Name: ${customerName}, Phone: ${customerPhone}, Email: ${customerEmail}`
  }

  const handleWhatsApp = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number")
      return
    }

    // Ensure WhatsApp link is configured
    if (!whatsappLink) {
      toast.error("WhatsApp ordering is not configured. Please contact support.")
      return
    }

    // Save order to database first
    try {
      await recordOrder("whatsapp")
      toast.success("Order placed successfully!")

      // Create order message with details
      const orderMessage = generateOrderMessage()
      const encodedMessage = encodeURIComponent(orderMessage)
      
      // Add message parameter to WhatsApp link
      const whatsappUrlWithMessage = `${whatsappLink}?text=${encodedMessage}`
      
      // Open WhatsApp with the order details
      window.open(whatsappUrlWithMessage, "_blank")
    } catch (error) {
      console.error("Error processing order:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process order"
      toast.error(`Failed to save order: ${errorMessage}`)
    }
  }

  const handleInstagram = () => {
    if (!customerName) {
      toast.error("Please enter your name")
      return
    }
    // Instagram DM deeplink (requires Instagram app or web)
    const message = encodeURIComponent(generateOrderMessage())
    window.open(`https://instagram.com`, "_blank")
    recordOrder("instagram")
    toast.success("Order placed! Opening Instagram...")
  }

  const handleFacebook = () => {
    if (!customerName) {
      toast.error("Please enter your name")
      return
    }
    // Facebook Messenger deeplink
    const message = encodeURIComponent(generateOrderMessage())
    window.open(`https://facebook.com`, "_blank")
    recordOrder("facebook")
    toast.success("Order placed! Opening Facebook...")
  }

  const recordOrder = async (orderType: string) => {
    try {
      const orderData = {
        productId: product.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        totalPrice: Number(totalPrice),
        orderType,
        quantity: Number(quantity) || 1,
      }
      
      console.log("Sending order data:", orderData)
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
      
      console.log("Response status:", response.status, response.statusText)
      
      if (!response.ok) {
        let errorData
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          try {
            errorData = await response.json()
          } catch (e) {
            const text = await response.text()
            console.error("Failed to parse error response as JSON. Response text:", text)
            errorData = { error: text || "Unknown error" }
          }
        } else {
          const text = await response.text()
          console.error("Non-JSON error response:", text)
          errorData = { error: text || `Server error: ${response.status} ${response.statusText}` }
        }
        
        console.error("Order creation failed - Full error data:", errorData)
        console.error("Response status:", response.status)
        
        throw new Error(errorData.error || errorData.details || `Failed to save order (Status: ${response.status})`)
      }
      
      const result = await response.json()
      console.log("Order created successfully:", result)
      return result
    } catch (error) {
      console.error("Error in recordOrder:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to save order: Unknown error")
    }
  }

  return (
    <Card className="p-6 space-y-4 bg-white border border-gray-200">
      {/* Customer Details */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Your Name *</label>
        <Input
          placeholder="Enter your full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Phone Number *</label>
        <Input
          placeholder="Enter your phone number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          type="tel"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Email (Optional)</label>
        <Input
          placeholder="Enter your email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          type="email"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 border rounded-lg hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 border rounded-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between mb-2">
          <span>Price per unit:</span>
          <span className="font-semibold">Rs. {product.price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Quantity:</span>
          <span className="font-semibold">{quantity}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-lg">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-[#d4549b]">Rs. {totalPrice}</span>
        </div>
      </div>

      {/* Ordering Methods */}
      <div className="space-y-3">
        <Button onClick={handleWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white">
          <MessageCircle className="mr-2" size={18} />
          Order via WhatsApp
        </Button>

        <Button onClick={handleInstagram} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
          <Instagram className="mr-2" size={18} />
          Order via Instagram
        </Button>

        <Button onClick={handleFacebook} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Facebook className="mr-2" size={18} />
          Order via Facebook
        </Button>
      </div>
    </Card>
  )
}

