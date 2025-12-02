"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Lock, Mail, MessageCircle } from "lucide-react"

interface AdminSettings {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface StoreSettings {
  whatsappNumber: string | null
  whatsappTemplate: string | null
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState("")
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ whatsappNumber: null, whatsappTemplate: null })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/login")
      return
    }

    fetchSettings()
  }, [user, isAdmin, router])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch settings")
      }

      const data = await response.json()
      setSettings(data.user)
      setEmail(data.user.email)
      setStoreSettings(data.settings)
      setWhatsappNumber(data.settings.whatsappNumber || "")
      setWhatsappTemplate(data.settings.whatsappTemplate || "")
      setLoading(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch settings"
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!currentPassword) {
      toast.error("Current password is required")
      return
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
    }

    if (email === settings?.email && !newPassword) {
      toast.error("No changes to save")
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email !== settings?.email ? email : undefined,
          currentPassword,
          newPassword: newPassword || undefined,
          whatsappNumber,
          whatsappTemplate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings")
      }

      setSettings(data.user)
      setStoreSettings(data.settings)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Settings updated successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update settings"
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-wide">Settings</h1>
            <p className="text-gray-500 mt-2 text-sm">Manage your admin account settings</p>
          </div>

          <div className="max-w-2xl">
            {/* Current Email Display */}
            <Card className="bg-white mb-8 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={24} className="text-gray-400" />
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Current Email</p>
                  <p className="text-lg text-gray-900 font-light mt-1">{settings?.email}</p>
                </div>
              </div>
            </Card>

            {/* Update Settings Form */}
            <Card className="bg-white p-6">
              <h2 className="text-xl font-light text-gray-900 mb-6">Update Your Account</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Email (Optional)</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Leave blank to keep current email"
                    className="w-full"
                  />
                  <p className="text-gray-500 text-xs mt-1">Leave blank to keep your current email</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full"
                    required
                  />
                  <p className="text-gray-500 text-xs mt-1">Required to confirm changes</p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock size={16} />
                    New Password (Optional)
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="w-full"
                  />
                  <p className="text-gray-500 text-xs mt-1">At least 6 characters</p>
                </div>

                {/* Confirm Password */}
                {newPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full"
                      required={!!newPassword}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setEmail(settings?.email || "")
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                    className="px-8 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Security Note:</strong> You must enter your current password to make any changes to your account.
                </p>
              </div>
            </Card>

            {/* WhatsApp Settings */}
            <Card className="bg-white p-6 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={24} className="text-green-600" />
                <h2 className="text-xl font-light text-gray-900">WhatsApp Ordering Settings</h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit(e)
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <Input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g., 94767388576"
                    className="w-full"
                  />
                  <p className="text-gray-500 text-xs mt-1">Enter your WhatsApp number in international format without + or spaces.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Template (Optional)</label>
                  <Input
                    value={whatsappTemplate}
                    onChange={(e) => setWhatsappTemplate(e.target.value)}
                    placeholder="Use placeholders: {product}, {qty}, {total}, {name}, {phone}, {email}"
                    className="w-full"
                  />
                  <p className="text-gray-500 text-xs mt-1">Example: "Order: {product} x{qty} - Rs. {total}. Name: {name}, Phone: {phone}, Email: {email}"</p>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save WhatsApp Settings"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setWhatsappNumber(storeSettings.whatsappNumber || "")
                      setWhatsappTemplate(storeSettings.whatsappTemplate || "")
                    }}
                    className="px-8 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
