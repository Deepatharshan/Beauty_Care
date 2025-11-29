"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/admin-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalReviews: number
  ordersByChannel: Array<{ name: string; value: number }>
  dailyRevenue: Array<{ date: string; revenue: number }>
  ordersByStatus: Array<{ name: string; value: number }>
}

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login")
      return
    }
    if (!authLoading && user && isAdmin) {
      fetchDashboardStats()
    }
  }, [authLoading, user, isAdmin, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      const data = await response.json()
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-wide">Dashboard</h1>
            <p className="text-gray-500 mt-2 text-sm">Welcome to your beauty store admin panel</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Orders</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">{stats?.totalOrders || 0}</p>
                </div>
                <ShoppingCart size={32} className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Revenue</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">
                    Rs. {(stats?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign size={32} className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Products</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">{stats?.totalProducts || 0}</p>
                </div>
                <Package size={32} className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Reviews</p>
                  <p className="text-3xl font-light text-gray-900 mt-2">{stats?.totalReviews || 0}</p>
                </div>
                <TrendingUp size={32} className="text-gray-400" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="channels">Order Channels</TabsTrigger>
              <TabsTrigger value="status">Order Status</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-medium mb-4 text-gray-900">Daily Revenue</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stats?.dailyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value) => `Rs. ${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#111827" name="Revenue" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="channels">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-white">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Orders by Channel</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats?.ordersByChannel || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#111827" />
                        <Cell fill="#6b7280" />
                        <Cell fill="#9ca3af" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 bg-white">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Channel Breakdown</h3>
                  <div className="space-y-4">
                    {stats?.ordersByChannel?.map((channel) => (
                      <div key={channel.name} className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm">{channel.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gray-900 h-full"
                              style={{
                                width: `${
                                  (channel.value /
                                    (stats?.ordersByChannel?.reduce((sum, c) => sum + c.value, 0) || 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="font-medium w-12 text-right text-sm">{channel.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="status">
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-medium mb-4 text-gray-900">Orders by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.ordersByStatus || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#111827" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
