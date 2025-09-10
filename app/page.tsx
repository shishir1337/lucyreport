"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { toast } from "sonner"
import { PublicCounter } from "@/components/public-counter"
import { createClient } from "@/lib/supabase/client"
import type { FraudReportInsert } from "@/lib/types/database"

export default function FraudReportPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    amountBdt: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "নাম আবশ্যক"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে"
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "মোবাইল নম্বর আবশ্যক"
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "দয়া করে একটি বৈধ বাংলাদেশী মোবাইল নম্বর দিন"
    }

    if (!formData.amountBdt.trim()) {
      newErrors.amountBdt = "পরিমাণ আবশ্যক"
    } else if (isNaN(Number(formData.amountBdt)) || Number(formData.amountBdt) <= 0) {
      newErrors.amountBdt = "দয়া করে একটি বৈধ পরিমাণ দিন"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("দয়া করে ফর্মের ত্রুটিগুলি সংশোধন করুন")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      const reportData: FraudReportInsert = {
        name: formData.name.trim(),
        mobile_number: formData.mobileNumber.replace(/\s/g, ""),
        amount_bdt: parseFloat(formData.amountBdt)
      }

      const { data, error } = await supabase
        .from('fraud_reports')
        .insert([reportData])
        .select()

      if (error) {
        console.error('Error submitting report:', error)
        throw error
      }

      if (data && data.length > 0) {
        toast.success("রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে। ন্যায়বিচার আনতে সাহায্য করার জন্য ধন্যবাদ।", {
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 4000,
        })
        setFormData({ name: "", mobileNumber: "", amountBdt: "" })
        setErrors({})
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error("রিপোর্ট জমা দিতে ব্যর্থ। দয়া করে আবার চেষ্টা করুন।")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatMobileNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 11) {
      return cleaned
    }
    return cleaned.slice(0, 11)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 sm:p-6">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        মূল কন্টেন্টে যান
      </a>
      <div id="main-content" className="mx-auto max-w-md space-y-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
              <Shield className="relative h-16 w-16 text-primary drop-shadow-lg group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance leading-tight tracking-tight">
              বিমানবন্দর ইমিগ্রেশন রিপোর্ট
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty max-w-sm mx-auto">
              ফারহানা হক লুসির বিরুদ্ধে আপনার রিপোর্ট জমা দিন। আপনার তথ্য তাকে দেশ ছেড়ে যেতে বাধা দিতে সাহায্য করবে।
            </p>
          </div>
        </div>

        {/* Public Counter */}
        <PublicCounter />

        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm hover:shadow-md transition-shadow duration-200" role="alert" aria-labelledby="notice-title">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 animate-pulse" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p id="notice-title" className="text-base font-semibold text-amber-800">গুরুত্বপূর্ণ নোটিশ</p>
                <p className="text-sm text-amber-700 leading-relaxed text-pretty">
                সাবমিট করা সমস্ত তথ্য বিমানবন্দর ইমিগ্রেশন কর্তৃপক্ষের কাছে পাঠানো হবে।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold">আপনার রিপোর্ট জমা দিন</CardTitle>
            </div>
            <CardDescription className="text-base leading-relaxed">
              আপনার প্রতারণার বিবরণ প্রদান করে আমাদের মামলা তৈরিতে সাহায্য করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="প্রতারণার রিপোর্ট ফর্ম">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium">
                  পূর্ণ নাম <span className="text-destructive" aria-label="আবশ্যক">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`h-12 text-base transition-all duration-200 touch-manipulation ${
                    errors.name 
                      ? "border-destructive focus:border-destructive ring-destructive/20" 
                      : "focus:border-primary focus:ring-primary/20"
                  }`}
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  মোবাইল নম্বর <span className="text-destructive" aria-label="আবশ্যক">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="সক্রিয় মোবাইল নম্বর (০১XXXXXXXXX)"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", formatMobileNumber(e.target.value))}
                  className={`h-12 text-base transition-all duration-200 touch-manipulation ${
                    errors.mobileNumber 
                      ? "border-destructive focus:border-destructive ring-destructive/20" 
                      : "focus:border-primary focus:ring-primary/20"
                  }`}
                  required
                  aria-invalid={!!errors.mobileNumber}
                  aria-describedby={errors.mobileNumber ? "mobile-error" : undefined}
                />
                {errors.mobileNumber && (
                  <p id="mobile-error" className="text-sm text-destructive flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium">
                  ক্ষতিগ্রস্ত অর্থের পরিমাণ (টাকা) <span className="text-destructive" aria-label="আবশ্যক">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="বৈধ পরিমাণ (টাকা) লিখুন"
                  value={formData.amountBdt}
                  onChange={(e) => handleInputChange("amountBdt", e.target.value)}
                  className={`h-12 text-base transition-all duration-200 touch-manipulation ${
                    errors.amountBdt 
                      ? "border-destructive focus:border-destructive ring-destructive/20" 
                      : "focus:border-primary focus:ring-primary/20"
                  }`}
                  min="1"
                  step="0.01"
                  required
                  aria-invalid={!!errors.amountBdt}
                  aria-describedby={errors.amountBdt ? "amount-error" : undefined}
                />
                {errors.amountBdt && (
                  <p id="amount-error" className="text-sm text-destructive flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{errors.amountBdt}</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px]"
                disabled={isSubmitting}
                aria-describedby="submit-description"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>রিপোর্ট জমা দেওয়া হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>রিপোর্ট জমা দিন</span>
                  </div>
                )}
                <span id="submit-description" className="sr-only">
                  ফর্ম জমা দেওয়ার জন্য বাটনে ক্লিক করুন
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-muted shadow-sm hover:shadow-md transition-shadow duration-200" role="complementary" aria-labelledby="privacy-title">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p id="privacy-title" className="text-sm font-medium text-foreground">গোপনীয়তা নিশ্চয়তা</p>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  আপনার ব্যক্তিগত তথ্য সুরক্ষিত এবং শুধুমাত্র আইনি কার্যক্রমের জন্য সংশ্লিষ্ট কর্তৃপক্ষের সাথে শেয়ার করা হবে।
                  <br />
                  <span className="font-medium text-primary">ডেটা এনক্রিপ্টেড এবং নিরাপদ।</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
