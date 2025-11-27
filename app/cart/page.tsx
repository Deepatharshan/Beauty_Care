"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOrderViaWhatsApp = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsSubmitting(true)

    try {
      // Save all orders to database
      const orderPromises = cart.map(async (item) => {
        const orderData = {
          productId: item.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          totalPrice: item.price * item.quantity,
          orderType: "whatsapp",
          quantity: item.quantity,
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          throw new Error(`Failed to save order for ${item.name}`)
        }

        return response.json()
      })

      await Promise.all(orderPromises)

      // Generate WhatsApp message
      const orderDetails = cart
        .map((item) => `${item.name} (Qty: ${item.quantity}) - Rs. ${item.price * item.quantity}`)
        .join("\n")
      const message = `Hello! I would like to order:\n\n${orderDetails}\n\nTotal: Rs. ${getCartTotal()}\n\nCustomer Details:\nName: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail || "N/A"}`

      const whatsappNumber = "94767388576"
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

      toast.success("Order placed successfully!")
      
      // Clear cart and close dialog
      clearCart()
      setShowOrderDialog(false)
      
      // Open WhatsApp
      window.open(whatsappLink, "_blank")
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrderViaInstagram = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsSubmitting(true)

    try {
      const orderPromises = cart.map(async (item) => {
        const orderData = {
          productId: item.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          totalPrice: item.price * item.quantity,
          orderType: "instagram",
          quantity: item.quantity,
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) throw new Error(`Failed to save order for ${item.name}`)
        return response.json()
      })

      await Promise.all(orderPromises)
      toast.success("Order placed successfully! Opening Instagram...")
      clearCart()
      setShowOrderDialog(false)
      window.open("https://instagram.com", "_blank")
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrderViaFacebook = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsSubmitting(true)

    try {
      const orderPromises = cart.map(async (item) => {
        const orderData = {
          productId: item.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          totalPrice: item.price * item.quantity,
          orderType: "facebook",
          quantity: item.quantity,
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) throw new Error(`Failed to save order for ${item.name}`)
        return response.json()
      })

      await Promise.all(orderPromises)
      toast.success("Order placed successfully! Opening Facebook...")
      clearCart()
      setShowOrderDialog(false)
      window.open("https://facebook.com", "_blank")
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link href="/">
              <Button className="bg-[#d4549b] hover:bg-[#c1408a] text-white">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Navbar />

      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[#d4549b] hover:text-[#c1408a]">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-lg font-bold text-[#d4549b] mb-3">Rs. {item.price}</p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                    <p className="font-bold text-gray-900">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#d4549b]">Rs. {getCartTotal()}</span>
                </div>
              </div>

              <Button
                onClick={() => setShowOrderDialog(true)}
                className="w-full bg-[#d4549b] hover:bg-[#c1408a] text-white mb-3"
                size="lg"
              >
                Proceed to Order
              </Button>

              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) {
                    clearCart()
                  }
                }}
                variant="outline"
                className="w-full"
              >
                Clear Cart
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>Choose your preferred ordering method</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between mb-2">
                <span>Total Items:</span>
                <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-[#d4549b]">Rs. {getCartTotal()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleOrderViaWhatsApp}
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Order via WhatsApp
              </Button>

              <Button
                onClick={handleOrderViaInstagram}
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                Order via Instagram
              </Button>

              <Button
                onClick={handleOrderViaFacebook}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Order via Facebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
