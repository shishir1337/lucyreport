"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, LogOut, Users, DollarSign, Search, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { FraudReport } from "@/lib/types/database"
import { EditReportModal } from "@/components/edit-report-modal"


export function AdminDashboard() {
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState<FraudReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingReport, setEditingReport] = useState<FraudReport | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('fraud_reports')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching reports:', error)
          setError('রিপোর্ট লোড করতে ব্যর্থ')
          return
        }

        if (data) {
          setReports(data)
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('রিপোর্ট লোড করতে ব্যর্থ')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      report.mobile_number.includes(searchTerm),
  )

  const totalAmount = reports.reduce((sum, report) => sum + report.amount_bdt, 0)


  const handleLogout = () => {
    logout()
    toast.success("সফলভাবে লগ আউট হয়েছে")
  }

  const handleEditReport = (report: FraudReport) => {
    setEditingReport(report)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditingReport(null)
    setIsEditModalOpen(false)
  }

  const handleUpdateReport = (updatedReport: FraudReport) => {
    setReports(prev => 
      prev.map(report => 
        report.id === updatedReport.id ? updatedReport : report
      )
    )
  }


  const formatNumberInBengali = (num: number) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)])
  }

  const formatAmountInBengali = (amount: number) => {
    return `৳${formatNumberInBengali(amount)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
              <Shield className="relative h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">অ্যাডমিন ড্যাশবোর্ড</h1>
              <p className="text-sm text-muted-foreground">প্রতারণার রিপোর্ট ব্যবস্থাপনা</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200" aria-label="লগ আউট করুন">
            <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
            লগ আউট
          </Button>
        </header>

        {/* Statistics */}
        <section aria-labelledby="stats-heading" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h2 id="stats-heading" className="sr-only">পরিসংখ্যান</h2>
          <Card className="hover:shadow-md transition-all duration-200 group">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{formatNumberInBengali(reports.length)}</p>
                  <p className="text-sm text-muted-foreground">মোট রিপোর্ট</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 group">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors duration-200">
                  <DollarSign className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{formatAmountInBengali(totalAmount)}</p>
                  <p className="text-sm text-muted-foreground">মোট পরিমাণ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  মামলার অবস্থা: সক্রিয়
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:ring-primary/20 transition-all duration-200"
              aria-label="রিপোর্ট অনুসন্ধান করুন"
            />
          </div>
        </div>

        {/* Reports Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">প্রতারণার রিপোর্ট</CardTitle>
            <CardDescription>ফারহানা হক লুসির বিরুদ্ধে জমা দেওয়া সমস্ত রিপোর্ট</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground">রিপোর্ট লোড হচ্ছে...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-destructive">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()} 
                    className="mt-4"
                  >
                    আবার চেষ্টা করুন
                  </Button>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    {searchTerm ? "আপনার অনুসন্ধানের সাথে কোনো রিপোর্ট মিলেনি।" : "এখনো কোনো রিপোর্ট জমা দেওয়া হয়নি।"}
                  </p>
                </div>
              ) : (
                filteredReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0 hover:bg-muted/50 transition-colors duration-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="space-y-1 flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors duration-200">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.mobile_number}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(report.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-accent">{formatAmountInBengali(report.amount_bdt)}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          রিপোর্ট #{report.id}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReport(report)}
                        className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                        aria-label={`রিপোর্ট #${report.id} সম্পাদনা করুন`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Report Modal */}
      <EditReportModal
        report={editingReport}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateReport}
      />
    </div>
  )
}
