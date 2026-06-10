"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Setup scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Parallax transforms for depth effect
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]) // Background element moves fastest up
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]) // Mid element
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])  // Foreground element
  const rotateScroll = useTransform(scrollYProgress, [0, 1], [0, 45])

  return (
    <section 
      ref={containerRef}
      className="relative bg-gradient-to-r from-gray-50 to-white overflow-hidden min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 md:px-8 z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center py-12 lg:py-24">
          
          {/* Left Content (Text) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 z-20"
          >
            <div className="inline-block">
              <span className="text-xs font-semibold tracking-wider text-gray-600">
                ESSENTIAL ITEMS
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-gray-900">
              Beauty Inspired<br />by Real Life
            </h1>
            <p className="text-gray-600 max-w-md text-lg">
              Made using clean, non-toxic ingredients, our products are designed for everyone. Experience the next level of skincare.
            </p>
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full transition-transform hover:scale-105">
              Shop Now
            </Button>
          </motion.div>

          {/* Right Content (3D Animated Products) */}
          <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000">
            
            {/* Background Blob */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute w-96 h-96 bg-[#c8d5d0] rounded-full filter blur-3xl opacity-30 mix-blend-multiply"
            />

            {/* Product 1: Serum (Foreground, enters from left, spins) */}
            <motion.div
              style={{ y: y3 }}
              initial={{ x: -200, y: 100, rotate: -45, opacity: 0, scale: 0.5 }}
              animate={{ x: -80, y: 50, rotate: -15, opacity: 1, scale: 1.1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4, delay: 0.2 }}
              className="absolute z-30"
            >
              <div className="relative w-48 h-64 md:w-64 md:h-80 drop-shadow-2xl">
                <Image
                  src="/images/3d-hero/serum.png"
                  alt="Luxury Serum"
                  fill
                  className="object-contain mix-blend-darken"
                  priority
                />
              </div>
            </motion.div>

            {/* Product 2: Cream Jar (Center, enters from bottom, subtle spin) */}
            <motion.div
              style={{ y: y2 }}
              initial={{ y: 300, rotate: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -40, rotate: 5, opacity: 1, scale: 1.3 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="absolute z-20"
            >
              <div className="relative w-56 h-56 md:w-72 md:h-72 drop-shadow-2xl">
                <Image
                  src="/images/3d-hero/cream.png"
                  alt="Luxury Cream"
                  fill
                  className="object-contain mix-blend-darken"
                  priority
                />
              </div>
            </motion.div>

            {/* Product 3: Perfume (Background, enters from right, spins) */}
            <motion.div
              style={{ y: y1, rotate: rotateScroll }}
              initial={{ x: 200, y: -100, rotate: 45, opacity: 0, scale: 0.5 }}
              animate={{ x: 100, y: -80, rotate: 15, opacity: 1, scale: 0.9 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4, delay: 0.4 }}
              className="absolute z-10"
            >
              <div className="relative w-40 h-56 md:w-56 md:h-72 drop-shadow-xl opacity-90">
                <Image
                  src="/images/3d-hero/perfume.png"
                  alt="Luxury Perfume"
                  fill
                  className="object-contain mix-blend-darken"
                  priority
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
