"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Package, RefreshCw, MessageCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import ProductCard from "@/components/product-card"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  createdAt?: string
  reviews?: any[]
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      badge: "ESSENTIAL ITEMS",
      title: "Beauty Inspired by Real Life",
      description: "Made using clean, non-toxic ingredients, our products are designed for everyone.",
      buttonText: "Shop Now",
    },
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
      setFeaturedProducts(data.slice(0, 4))
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Top Banner */}
      <div className="bg-[#5a7c6f] text-white text-center py-2 text-sm">
        Free shipping on all U.S orders $50+
      </div>

      {/* Hero Carousel */}
      <section className="relative bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px] py-12">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <div className="inline-block">
                <span className="text-xs font-semibold tracking-wider text-gray-600">
                  {heroSlides[currentSlide].badge}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-light leading-tight text-gray-900">
                Beauty Inspired<br />by Real Life
              </h1>
              <p className="text-gray-600 max-w-md">
                {heroSlides[currentSlide].description}
              </p>
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-base">
                {heroSlides[currentSlide].buttonText}
              </Button>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] flex items-center justify-center">
              <div className="relative w-full h-full max-w-md mx-auto">
                <Image
                  src="/placeholder.svg"
                  alt="Featured Product"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-gray-100 rounded-full -translate-y-1/2 translate-x-1/4 -z-10" />
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 pb-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-gray-800" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              Our Featured Products
            </h2>
            <p className="text-gray-600">Get the skin you want to feel</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden lg:block">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden lg:block">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Banner */}
            <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <span className="text-xs font-semibold tracking-wider text-gray-600">
                      NEW COLLECTION
                    </span>
                    <h3 className="text-3xl font-light text-gray-900">
                      Intensive Glow C+ Serum
                    </h3>
                    <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                      Explore More
                    </Button>
                  </div>
                  <div className="relative w-48 h-64">
                    <Image
                      src="/placeholder.svg"
                      alt="Serum"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Banner */}
            <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-br from-[#c8d5d0] to-[#e8f0ed]">
              <CardContent className="p-8 md:p-12 relative">
                <div className="space-y-4 relative z-10">
                  <h3 className="text-3xl font-light text-gray-900">
                    25% off Everything
                  </h3>
                  <p className="text-gray-700 max-w-xs">
                    Makeup with extended range in colors for every human.
                  </p>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Explore More
                  </Button>
                </div>
                <div className="absolute bottom-0 right-0 w-48 h-48 opacity-20">
                  <Image
                    src="/placeholder.svg"
                    alt="Products"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Package,
                title: "Free Shipping",
                description: "Free shipping for orders over $50",
              },
              {
                icon: RefreshCw,
                title: "Returns",
                description: "Within 30 days for an exchange",
              },
              {
                icon: MessageCircle,
                title: "Online Support",
                description: "24 hours a day, 7 days a week",
              },
              {
                icon: CreditCard,
                title: "Flexible Payment",
                description: "Pay with Multiple Credit Cards",
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gray-50">
                    <item.icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              As seen in
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                logo: "Parker & Co.",
                quote: "Also the customer service is phenomenal. I would purchase again!",
              },
              {
                logo: "HAYDEN",
                quote: "Great product line, Very attentive staff to deal with.",
              },
              {
                logo: "GOOD MOOD",
                quote: "Looking to affordably upgrade your everyday skincare? Look no further.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="font-bold text-xl tracking-wider text-gray-900">
                    {testimonial.logo}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
