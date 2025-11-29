"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = Cookies.get("auth_token")
    if (token) {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          Cookies.remove("auth_token")
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        Cookies.remove("auth_token")
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      Cookies.set("auth_token", data.token, { expires: 7 })
      setUser(data.user)
      toast.success("Login successful!")
      
      // Redirect based on role with longer delay to ensure state is set
      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }, 300)
    } catch (error: any) {
      toast.error(error.message || "Login failed")
      throw error
    }
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      Cookies.set("auth_token", data.token, { expires: 7 })
      setUser(data.user)
      toast.success("Registration successful!")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
      throw error
    }
  }

  const logout = () => {
    Cookies.remove("auth_token")
    setUser(null)
    toast.success("Logged out successfully")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
