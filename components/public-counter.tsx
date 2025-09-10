"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface CounterStats {
  totalReports: number
  lastUpdated: string
}

export function PublicCounter() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<CounterStats>({
    totalReports: 0,
    lastUpdated: new Date().toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
      timeStyle: "short",
    }),
  })

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()
        
        const { count, error } = await supabase
          .from('fraud_reports')
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.error('Error fetching report count:', error)
          // Fallback to a default number if there's an error
          setStats(prev => ({ ...prev, totalReports: 0 }))
        } else {
          setStats(prev => ({ 
            ...prev, 
            totalReports: count || 0,
            lastUpdated: new Date().toLocaleString("bn-BD", {
              timeZone: "Asia/Dhaka",
              dateStyle: "medium",
              timeStyle: "short",
            })
          }))
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setStats(prev => ({ ...prev, totalReports: 0 }))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // Update timestamp every minute
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleString("bn-BD", {
          timeZone: "Asia/Dhaka",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {/* Main Counter */}
      <Card className="border-primary/20 bg-card hover:shadow-md transition-all duration-300 group">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-bold text-primary tabular-nums animate-fade-in-up">{stats.totalReports}</span>
              )}
            </div>
            <p className="text-sm font-medium text-primary">মোট রিপোর্ট জমা দেওয়া হয়েছে</p>
            {isLoading ? (
              <Skeleton className="h-3 w-32 mx-auto" />
            ) : (
              <p className="text-xs text-muted-foreground">সর্বশেষ আপডেট: {stats.lastUpdated}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>মামলার শক্তি বৃদ্ধি</span>
            {isLoading ? (
              <Skeleton className="h-3 w-8" />
            ) : (
              <span className="font-medium tabular-nums">{Math.min(100, Math.round((stats.totalReports / 50) * 100))}%</span>
            )}
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, (stats.totalReports / 50) * 100)}%` }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">প্রতিটি রিপোর্ট মামলাকে শক্তিশালী করে</p>
        </CardContent>
      </Card>
    </div>
  )
}
