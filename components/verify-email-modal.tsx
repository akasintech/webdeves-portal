"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface VerifyEmailModalProps {
  open: boolean
  onClose: () => void
  email: string
}

export function VerifyEmailModal({ open, onClose, email }: VerifyEmailModalProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (open) {
      inputRefs.current[0]?.focus()
    }
  }, [open])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    console.log("[v0] Verification code:", code.join(""))
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-8">
        <div className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8b1c5c]">
            <Mail className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-center text-[24px] font-semibold text-gray-900">Verify your email</h2>

          <p className="text-center text-[14px] text-gray-600">
            We've sent a 6 digit code to the email <span className="font-medium text-gray-900">{email}</span>
          </p>

          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-11 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-[#8b1c5c] focus:outline-none focus:ring-2 focus:ring-[#8b1c5c]/20"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
          >
            Verify email
          </Button>

          <p className="text-center text-[13px] text-gray-600">
            Code expired. <button className="text-[#8b1c5c] hover:underline font-medium">Resend code</button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
