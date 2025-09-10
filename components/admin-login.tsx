"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      toast.error("দয়া করে অ্যাডমিন পাসওয়ার্ড দিন")
      return
    }

    setIsLoading(true)

    try {
      const success = await login(password)
      if (success) {
        toast.success("সফলভাবে লগইন হয়েছে")
      } else {
        toast.error("ভুল পাসওয়ার্ড")
        setPassword("")
      }
    } catch {
      toast.error("লগইন ব্যর্থ। দয়া করে আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
                <Shield className="relative h-12 w-12 text-primary group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold">অ্যাডমিন অ্যাক্সেস</CardTitle>
            <CardDescription className="text-base leading-relaxed">প্রতারণার রিপোর্ট দেখতে অ্যাডমিন পাসওয়ার্ড দিন</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">অ্যাডমিন পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="অ্যাডমিন পাসওয়ার্ড দিন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base focus:ring-primary/20 transition-all duration-200"
                    required
                    aria-describedby="password-description"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p id="password-description" className="text-xs text-muted-foreground">
                  নিরাপদ অ্যাডমিন অ্যাক্সেসের জন্য পাসওয়ার্ড প্রয়োজন
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>লগইন হচ্ছে...</span>
                  </div>
                ) : (
                  "লগইন"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
