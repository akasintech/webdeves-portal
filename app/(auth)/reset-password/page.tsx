"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">New password created</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create new password</h1>
        <p className="text-gray-600 text-sm">Please enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="h-12 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-3">Password must contain:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  passwordValidation.minLength ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {passwordValidation.minLength && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={passwordValidation.minLength ? "text-green-700" : "text-gray-600"}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  passwordValidation.hasUppercase ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {passwordValidation.hasUppercase && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={passwordValidation.hasUppercase ? "text-green-700" : "text-gray-600"}>
                One uppercase letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  passwordValidation.hasLowercase ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {passwordValidation.hasLowercase && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={passwordValidation.hasLowercase ? "text-green-700" : "text-gray-600"}>
                One lowercase letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  passwordValidation.hasNumber ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {passwordValidation.hasNumber && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={passwordValidation.hasNumber ? "text-green-700" : "text-gray-600"}>One number</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 bg-[#8C2453] hover:bg-[#6B1A3E]" disabled={loading}>
          {loading ? "Resetting password..." : "Reset password"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-sm text-[#8C2453] hover:underline font-medium">
          Back to login
        </Link>
      </div>
    </div>
  )
}
