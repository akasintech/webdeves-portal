"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

interface ResetPasswordModalProps {
  open: boolean
  onClose: () => void
}

export function ResetPasswordModal({ open, onClose }: ResetPasswordModalProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8b1c5c]">
            <Lock className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-center text-[24px] font-semibold text-gray-900">Create new password</h2>

          <p className="text-center text-[14px] text-gray-600">
            Hi John, let's create a new password for accessing your account
          </p>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[13px] font-medium text-gray-700">
              New password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-11 text-[15px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[13px] font-medium text-gray-700">
              Re-enter new password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="h-11 text-[15px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
          >
            Create new password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
