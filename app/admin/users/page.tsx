"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/admin-sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login")
    }
  }, [authLoading, user, isAdmin, router])

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers()
    }
  }, [user, isAdmin])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = errorData.error || `Failed to fetch users: ${response.statusText}`
        throw new Error(errorMsg)
      }
      
      const data = await response.json()
      
      // Ensure data is an array
      const usersArray = Array.isArray(data) ? data : []
      setUsers(usersArray)
      setError(null)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users"
      setError(errorMessage)
      setUsers([])
      setLoading(false)
    }
  }

  const customerCount = users.length > 0 ? users.filter(u => u.role === "customer").length : 0
  const adminCount = users.length > 0 ? users.filter(u => u.role === "admin").length : 0

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-wide">Users</h1>
            <p className="text-gray-500 mt-2 text-sm">View registered users and their activity</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">{users.length}</p>
                </div>
                <Users size={32} className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Customers</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">{customerCount}</p>
                </div>
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Admins</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">{adminCount}</p>
                </div>
                <Users size={32} className="text-gray-400" />
              </div>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </TableCell>
                      <TableCell className="text-gray-700">{user.email}</TableCell>
                      <TableCell className="text-gray-700">{user.phone}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{user._count.orders}</span>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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
