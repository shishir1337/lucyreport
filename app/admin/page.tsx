"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AuthProvider } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    </AuthProvider>
  )
}
