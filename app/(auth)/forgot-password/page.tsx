"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockAuthApi } from "@/lib/mock-api"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await mockAuthApi.resetPassword(email)
      setEmailSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-[#8C2453]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-[#8C2453]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Email sent</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          We've sent a password reset link to <strong className="text-gray-900">{email}</strong>. Please check your
          email and follow the instructions to reset your password.
        </p>
        <Link href="/login">
          <Button className="w-full h-12 bg-[#8C2453] hover:bg-[#6B1A3E]">Back to login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Link
        href="/login"
        className="inline-flex items-center text-sm text-gray-600 hover:text-[#8C2453] mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
        <p className="text-gray-600 text-sm">
          No worries! Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
          />
        </div>

        <Button type="submit" className="w-full h-12 bg-[#8C2453] hover:bg-[#6B1A3E]" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </div>
  )
}
