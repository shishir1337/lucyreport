"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { FraudReport } from "@/lib/types/database"

interface EditReportModalProps {
  report: FraudReport | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedReport: FraudReport) => void
}

export function EditReportModal({ report, isOpen, onClose, onUpdate }: EditReportModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    amount_bdt: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update form data when report changes
  useEffect(() => {
    if (report) {
      setFormData({
        name: report.name,
        mobile_number: report.mobile_number,
        amount_bdt: report.amount_bdt.toString()
      })
    }
  }, [report])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!report) return

    // Validation
    if (!formData.name.trim()) {
      toast.error("নাম প্রয়োজন")
      return
    }
    
    if (!formData.mobile_number.trim()) {
      toast.error("মোবাইল নম্বর প্রয়োজন")
      return
    }

    const amount = parseFloat(formData.amount_bdt)
    if (isNaN(amount) || amount <= 0) {
      toast.error("সঠিক পরিমাণ লিখুন")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('fraud_reports')
        .update({
          name: formData.name.trim(),
          mobile_number: formData.mobile_number.trim(),
          amount_bdt: amount
        })
        .eq('id', report.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating report:', error)
        toast.error("রিপোর্ট আপডেট করতে ব্যর্থ")
        return
      }

      if (data) {
        onUpdate(data)
        toast.success("রিপোর্ট সফলভাবে আপডেট হয়েছে")
        onClose()
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error("রিপোর্ট আপডেট করতে ব্যর্থ")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  if (!isOpen || !report) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">রিপোর্ট সম্পাদনা করুন</CardTitle>
            <CardDescription>রিপোর্ট #{report.id} এর তথ্য আপডেট করুন</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">নাম</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="পূর্ণ নাম লিখুন"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile_number">মোবাইল নম্বর</Label>
              <Input
                id="mobile_number"
                value={formData.mobile_number}
                onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                placeholder="01XXXXXXXXX"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_bdt">পরিমাণ (টাকা)</Label>
              <Input
                id="amount_bdt"
                type="number"
                value={formData.amount_bdt}
                onChange={(e) => handleInputChange("amount_bdt", e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    আপডেট করুন
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
