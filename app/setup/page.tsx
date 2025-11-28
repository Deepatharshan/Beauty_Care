"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    setLoading(true)
    try {
      // Register admin user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Admin",
          email: "admin@glowing.com",
          phone: "0000000000",
          password: "admin123",
        }),
      })

      if (response.ok) {
        toast.success("Admin account created successfully!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create admin account")
      }
    } catch (error) {
      toast.error("Error during setup")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg p-8">
        <h1 className="text-2xl font-light text-gray-900 mb-4 text-center">Initial Setup</h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Create the admin account to get started
        </p>
        
        <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Admin Credentials:</p>
          <p className="text-xs text-gray-600">Email: admin@glowing.com</p>
          <p className="text-xs text-gray-600">Password: admin123</p>
        </div>

        <Button
          onClick={handleSetup}
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          {loading ? "Setting up..." : "Create Admin Account"}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          After setup, you can log in and create more users
        </p>
      </Card>
    </div>
  )
}
