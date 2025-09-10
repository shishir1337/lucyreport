"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { AdminLogin } from "@/components/admin-login"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Checking authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <>{children}</>
}
