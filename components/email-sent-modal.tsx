"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface EmailSentModalProps {
  open: boolean
  onClose: () => void
  email: string
}

export function EmailSentModal({ open, onClose, email }: EmailSentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-8">
        <div className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8b1c5c]">
            <Mail className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-center text-[24px] font-semibold text-gray-900">Email sent</h2>

          <p className="text-center text-[14px] text-gray-600">
            We have sent an email to <span className="font-medium text-gray-900">"{email}"</span> with a link to reset
            your password. Search your inbox for the email.
          </p>

          <Button
            onClick={onClose}
            className="w-full h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
          >
            Ok done
          </Button>

          <p className="text-center text-[13px] text-gray-600">
            Didn't get the email. <button className="text-[#8b1c5c] hover:underline font-medium">Resend email</button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
