"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void
  onBackToLogin: () => void
}

export function ForgotPasswordForm({ onSubmit, onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Forgot your password?</h1>
        <p className="text-[15px] text-gray-600">
          Did you forget your password? Let's help you get back in. We'll send you an email to verify that this is your
          account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 text-[15px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
        >
          Send email
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-[14px] text-[#8b1c5c] hover:underline font-medium"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  )
}
