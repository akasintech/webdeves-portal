"use client"

import { useState } from "react"
import Image from "next/image"
import { SignupForm } from "./signup-form"
import { LoginForm } from "./login-form"
import { Logo } from "./logo"
import { ForgotPasswordForm } from "./forgot-password-form"
import { VerifyEmailModal } from "./verify-email-modal"
import { EmailSentModal } from "./email-sent-modal"
import { ResetPasswordModal } from "./reset-password-modal"
import { PasswordResetSuccessModal } from "./password-reset-success-modal"

type AuthView = "signup" | "login" | "forgot-password"

export function AuthLayout() {
  const [currentView, setCurrentView] = useState<AuthView>("signup")
  const [showVerifyEmail, setShowVerifyEmail] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showResetSuccess, setShowResetSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleSignupSubmit = (email: string) => {
    setUserEmail(email)
    setShowVerifyEmail(true)
  }

  const handleVerifyComplete = () => {
    setShowVerifyEmail(false)
    setCurrentView("login")
  }

  const handleForgotPasswordSubmit = (email: string) => {
    setUserEmail(email)
    setShowEmailSent(true)
  }

  const handleEmailSentClose = () => {
    setShowEmailSent(false)
    setShowResetPassword(true)
  }

  const handleResetPasswordSubmit = () => {
    setShowResetPassword(false)
    setShowResetSuccess(true)
  }

  const handleResetSuccessClose = () => {
    setShowResetSuccess(false)
    setCurrentView("login")
  }

  return (
    <div className="min-h-screen p-2 flex">
      {/* Left Side - Form */}
      <div className="w-full max-w-180  ">
          <div className="flex justify-between items-center w-full mb-10 mt-3 px-8">
                  {/* Logo */}
                    <div className="">
                      <Logo />
                    </div>
                    <div className="md:block hidden">
                        {currentView !== "login" ? (
                      <p className="text-[14px] text-gray-600">
                          Already have an account?{" "}
                          <button type="button" onClick={() => setCurrentView("login")} className="text-[#8b1c5c] hover:underline font-semibold">
                            Login
                          </button>
                        </p>
                     ) : (
                       <p className="text-[14px] text-gray-600">
                          Don't have an account yet?{" "}
                          <button type="button" onClick={() => setCurrentView("signup")} className="text-[#8b1c5c] hover:underline font-semibold">
                            Signup
                          </button>
                        </p>
                     )}
                    </div>
                   
                </div>
          <div className="flex items-center justify-center w-full">

        <div className="w-full px-8 pb-8 lg:pb-16 lg:px-16">
          {/* Forms */}
          {currentView === "signup" && (
            <SignupForm onSubmit={handleSignupSubmit} onLoginClick={() => setCurrentView("login")} />
          )}
          {currentView === "login" && (
            <LoginForm onSignupClick={() => setCurrentView("signup")} onForgotPasswordClick={() => setCurrentView("forgot-password")}
            />
          )}
          {currentView === "forgot-password" && (
            <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} onBackToLogin={() => setCurrentView("login")} />
          )}
        </div>
                </div>
      </div>

      {/* Right Side - Banner Image */}
      <div className="hidden lg:block w-full max-w-180 relative bg-[#1a0a1a] rounded-lg overflow-hidden">
        <Image
          src="/images/banner.png"
          alt="Webdeves academy collaborative learning"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white/90 space-y-2">
          <h2 className="text-lg text-center font-semibold">Webdeves academy</h2>
          <p className="text-xs text-center opacity-90">Welcome to webdeves academy where learning meets creativity.</p>
        </div>
      </div>

      {/* Modals */}
      <VerifyEmailModal open={showVerifyEmail} onClose={handleVerifyComplete} email={userEmail} />
      <EmailSentModal open={showEmailSent} onClose={handleEmailSentClose} email={userEmail} />
      <ResetPasswordModal open={showResetPassword} onClose={handleResetPasswordSubmit} />
      <PasswordResetSuccessModal open={showResetSuccess} onClose={handleResetSuccessClose} />
    </div>
  )
}
