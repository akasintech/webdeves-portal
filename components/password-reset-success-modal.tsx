"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface PasswordResetSuccessModalProps {
  open: boolean
  onClose: () => void
}

export function PasswordResetSuccessModal({ open, onClose }: PasswordResetSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-8">
        <div className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-center text-[24px] font-semibold text-gray-900">New password created</h2>

          <p className="text-center text-[14px] text-gray-600">
            Congrats! you have created a new password. please login with it
          </p>

          <Button
            onClick={onClose}
            className="w-full h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
