"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Filter, X, ShoppingCart } from "lucide-react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselImages = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ]

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Rotate carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Get unique categories
  const categories = ["all", ...new Set(products.map((p) => p.category))]

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesPrice && matchesSearch
    })

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, priceRange, searchQuery, sortBy])

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      router.push("/login")
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <main>
      <Navbar />

      {/* Hero Carousel Section */}
      <div className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Beauty showcase ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Carousel Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
          <div className="max-w-2xl px-4">
            <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-4 animate-fade-in drop-shadow-lg">
              DISCOVER BEAUTY
            </h1>
            <p className="text-lg md:text-xl text-gray-100 font-light mb-8 animate-fade-in-delay drop-shadow-md">
              Explore our premium collection of skincare and cosmetics
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-white text-gray-900 hover:bg-gray-50 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all">
                Shop Now
              </Button>
              <Button className="bg-gray-900/80 text-white hover:bg-gray-900 border-2 border-white font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* Search */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Search Products</h3>
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-gray-300"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize transition">
                          {category === "all" ? "All Products" : category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Min: Rs. {priceRange.min}</label>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Max: Rs. {priceRange.max}</label>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedCategory("all")
                    setPriceRange({ min: 0, max: 100000 })
                    setSearchQuery("")
                    setSortBy("newest")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6 flex items-center justify-between gap-3">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Filter size={18} />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Mobile Filter Drawer */}
              {mobileFilterOpen && (
                <div className="lg:hidden mb-6 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filters</h3>
                    <button onClick={() => setMobileFilterOpen(false)}>
                      <X size={20} />
                    </button>
                  </div>

                  {/* Mobile Search */}
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-2">Search</label>
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Mobile Category */}
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Products" : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-2">
                      Price: Rs. {priceRange.min} - Rs. {priceRange.max}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full mb-2"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 mb-4">No products found matching your filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange({ min: 0, max: 100000 })
                      setSearchQuery("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white"
                      >
                        {/* Product Image */}
                        <div className="relative h-64 bg-gray-100 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                          {/* Add to Cart Floating Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition flex items-center gap-2"
                            >
                              <ShoppingCart size={18} />
                              Add to Cart
                            </button>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900 capitalize">
                            {product.category}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-medium text-gray-900 mb-1 hover:text-gray-600 transition line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-900">Rs. {product.price}</span>
                            <Link href={`/product/${product.id}`}>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDelay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeInDelay 0.8s ease-out 0.2s backwards;
        }
      `}</style>
    </main>
  )
}
