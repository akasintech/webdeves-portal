"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAuthApi } from "@/lib/mock-api"
import { authUtils } from "@/lib/auth"
import { Eye, EyeOff, Check } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    program: "",
    cohort: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    setError("")
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("Please fill in all fields")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!formData.program || !formData.cohort) {
        setError("Please select program and cohort")
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
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

    try {
      const { user, token } = await mockAuthApi.signup(formData)
      authUtils.setAuth(token, user)
      router.push("/student/dashboard")
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
        <p className="text-gray-600 text-sm">Join Webdeves Academy and start your learning journey</p>
      </div>

      {/* Progress indicators */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              step >= 1 ? "bg-[#8C2453] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step > 1 ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <div className={`w-20 h-1 transition-colors ${step >= 2 ? "bg-[#8C2453]" : "bg-gray-200"}`} />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              step >= 2 ? "bg-[#8C2453] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step > 2 ? <Check className="h-5 w-5" /> : "2"}
          </div>
          <div className={`w-20 h-1 transition-colors ${step >= 3 ? "bg-[#8C2453]" : "bg-gray-200"}`} />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              step >= 3 ? "bg-[#8C2453] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234-801-234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <Button type="button" onClick={handleNext} className="w-full h-12 bg-[#8C2453] hover:bg-[#6B1A3E]">
              Continue
            </Button>
          </>
        )}

        {/* Step 2: Program Selection */}
        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="program" className="text-sm font-medium text-gray-700">
                Select Program
              </Label>
              <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cohort" className="text-sm font-medium text-gray-700">
                Select Cohort
              </Label>
              <Select value={formData.cohort} onValueChange={(value) => setFormData({ ...formData, cohort: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cohort 2024-A">Cohort 2024-A (January 2024)</SelectItem>
                  <SelectItem value="Cohort 2024-B">Cohort 2024-B (April 2024)</SelectItem>
                  <SelectItem value="Cohort 2024-C">Cohort 2024-C (July 2024)</SelectItem>
                  <SelectItem value="Cohort 2024-D">Cohort 2024-D (October 2024)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 border-gray-300 bg-transparent"
              >
                Back
              </Button>
              <Button type="button" onClick={handleNext} className="flex-1 h-12 bg-[#8C2453] hover:bg-[#6B1A3E]">
                Continue
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Password Creation */}
        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Create Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
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

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 border-gray-300 bg-transparent"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 h-12 bg-[#8C2453] hover:bg-[#6B1A3E]" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </>
        )}
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#8C2453] hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
