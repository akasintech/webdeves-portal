"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { mockAuthApi } from "@/lib/mock-api"
import { authUtils } from "@/lib/auth"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onSignupClick: () => void
  onForgotPasswordClick: () => void
}

export function LoginForm({ onSignupClick, onForgotPasswordClick }: LoginFormProps) {
   const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login submitted:", formData)

    try {
          const { user, token } = await mockAuthApi.login(formData.email, formData.password)
          authUtils.setAuth(token, user)
    
          // Redirect based on role
          switch (user.role) {
            case "student":
              router.push("/student/dashboard")
              break
            case "instructor":
              router.push("/instructor/dashboard")
              break
            case "admin":
              router.push("/admin/dashboard")
              break
            case "parent":
              router.push("/parent/dashboard")
              break
            default:
              router.push("/")
          }
        } catch (err: any) {
          setError(err.message || "Login failed. Please try again.")
        } finally {
          setLoading(false)
        }
      }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Login</h1>
        <p className="text-[15px] text-gray-600">Fill in your account information to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
         {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="h-11 text-[15px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="h-11 text-[15px]"
          />
           <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-[14px] text-[#8b1c5c] hover:underline font-medium"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full h-12 bg-[#8C2453] hover:bg-[#6B1A3E]" disabled={loading}>
                 {loading ? "Logging in..." : "Login"}
               </Button>

        <div className="text-center pt-2 md:hidden block">
          <p className="text-[14px] text-gray-600">
            Don't have an account?{" "}
            <button type="button" onClick={onSignupClick} className="text-[#8b1c5c] hover:underline font-medium">
              Create account
            </button>
          </p>
        </div>
      </form>
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold mb-2 text-gray-900">Demo Credentials:</p>
              <div className="text-xs text-gray-700 space-y-1">
                <p>
                  <strong>Student:</strong> john.doe@example.com / password123
                </p>
                <p>
                  <strong>Instructor:</strong> michael.johnson@webdeves.com / password123
                </p>
                <p>
                  <strong>Admin:</strong> admin@webdeves.com / password123
                </p>
              </div>
            </div>
    </div>
  )
}
