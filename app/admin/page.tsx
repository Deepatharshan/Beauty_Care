"use client"

import { useState, useEffect } from "react"
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
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      const data = await response.json()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4549b]"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your beauty store admin panel</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Orders</p>
                  <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{stats?.totalOrders || 0}</p>
                </div>
                <ShoppingCart size={32} className="text-[#d4549b]" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#1a1a1a] mt-2">
                    Rs. {(stats?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign size={32} className="text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Products</p>
                  <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{stats?.totalProducts || 0}</p>
                </div>
                <Package size={32} className="text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Reviews</p>
                  <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{stats?.totalReviews || 0}</p>
                </div>
                <TrendingUp size={32} className="text-orange-500" />
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
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-[#1a1a1a]">Daily Revenue</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stats?.dailyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rs. ${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#d4549b" name="Revenue" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="channels">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-[#1a1a1a]">Orders by Channel</h3>
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
                        <Cell fill="#d4549b" />
                        <Cell fill="#f5a9d0" />
                        <Cell fill="#c1408a" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-[#1a1a1a]">Channel Breakdown</h3>
                  <div className="space-y-4">
                    {stats?.ordersByChannel?.map((channel) => (
                      <div key={channel.name} className="flex items-center justify-between">
                        <span className="text-gray-700">{channel.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#d4549b] h-full"
                              style={{
                                width: `${
                                  (channel.value /
                                    (stats?.ordersByChannel?.reduce((sum, c) => sum + c.value, 0) || 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="font-semibold w-12 text-right">{channel.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="status">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-[#1a1a1a]">Orders by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.ordersByStatus || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#d4549b" name="Orders" />
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
