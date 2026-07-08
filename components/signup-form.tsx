"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, UploadCloud } from "lucide-react"

interface SignupFormProps {
  onSubmit: (email: string) => void
  onLoginClick: () => void
}

export function SignupForm({ onSubmit, onLoginClick }: SignupFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    username: "",
    role: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    passportPhoto: null as File | null,
    bio: "",
    agreeToTerms: false,
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // function comfirmPasswords() {

  // }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== confirmPassword) return;
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData.email)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, passportPhoto: e.target.files[0] })
    }
  }

  return (
    <div>

      {step === 1 ? (
        <>
          <div className="mb-8 flex justify-center items-center flex-col">
            <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Create an account</h1>
            <p className="text-[15px] text-gray-600">Fill in your information to get started</p>
          </div>

          <form onSubmit={handleContinue} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                {/* <Label htmlFor="firstName" className="text-[13px] font-medium text-gray-700 bg-white p-1 absolute top-[-14px] left-1.5">
                  First name
                </Label> */}
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
                />
              </div>
              <div className="relative">
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
                />
              </div>
            </div>

            <div className="">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
              />
            </div>
            <div className="">
              <Input
                id="phoneNo"
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNo}
                onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                required
                className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
              />
            </div>

            <div className="grid grid-cols-2 w-full gap-3">
              <div className="space-y-2">
                <Input
                  id="username"
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    <SelectItem value="ui/ux">UI/UX</SelectItem>
                    <SelectItem value="computer-basics">Computer Basics</SelectItem>
                    <SelectItem value="date-analysis">Data Analysis</SelectItem>
                    <SelectItem value="website-development">Website Development</SelectItem>
                    <SelectItem value="cyber-security">Cyber Security</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"

              />
              <span className="absolute right-3 top-2 cursor-pointer text- font-light text-black/60" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</span>
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
              />
              <span className="absolute right-3 top-2 cursor-pointer text- font-light text-black/60" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff /> : <Eye />}</span>
            </div>
            <div className={`${confirmPassword && formData.password !== confirmPassword ? "text-xs text-red-500/90 -translate-y-2 opacity-100 duration-200" : "opacity-0 bg-red-500/90 duration-200"}`}>Passwords don't match</div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
            >
              Continue
            </Button>

            <div className="text-center pt-2 md:hidden block">
              <p className="text-[14px] text-gray-600">
                Already have an account?{" "}
                <button type="button" onClick={onLoginClick} className="text-[#8b1c5c] hover:underline font-medium">
                  Login
                </button>
              </p>
            </div>
          </form>

        </>
      ) : (
        <>
          <div className="mb-8 flex flex-col justify-center items-center">
            <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Create an account</h1>
            <p className="text-[15px] text-gray-600">Your almost done. Fill in your bio data</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className='space-y-2 flex gap-2 w-full *:w-full'>
              <div className="">
                <Label htmlFor="dateOfBirth" className="text-[12px] font-medium text-gray-700 relative">
                  <span className='absolute left-2 -top-3 bg-white p-1'>Date of Birth</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  placeholder='Date of Birth'
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                  className="text-[15px] p-3 outline-0 focus:outline-0 focus-visible:ring-0 selection:bg-transparent bg-transparent"
                />
              </div>
              <div className="">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="passportPhoto" className="relative text-sm p-4 font-medium text-primary *:text-primary/80 flex justify-center items-center bg-primary/10">
                <svg
                  className="absolute inset-0 top-1 pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <rect
                    x="1"
                    y="1"
                    width="190"
                    height="20"
                    rx="12"
                    ry="12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-dasharray="10 8"
                    vector-effect="non-scaling-stroke"
                  />
                </svg>
                <span className="flex gap-4 items-center justify-center relative"><UploadCloud /> Upload passport photo</span>
              </Label>
              <Input
                id="passportPhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="h-11 text-[14px] cursor-pointer hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[13px] font-medium text-gray-700">
                Bio / Guardian info
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself or guardian information"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="min-h-25 text-[15px] resize-none"
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                required
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-[13px] text-gray-600 leading-tight cursor-pointer">
                I agree to the terms and conditions
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12 text-[15px] font-medium border-gray-300"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#8b1c5c] hover:bg-[#751750] text-white text-[15px] font-medium"
              >
                Create account
              </Button>
            </div>
            <div className="text-center pt-2 md:hidden block">
              <p className="text-[14px] text-gray-600">
                Already have an account?{" "}
                <button type="button" onClick={onLoginClick} className="text-[#8b1c5c] hover:underline font-medium">
                  Login
                </button>
              </p>
            </div>
          </form>
        </>
      )}
      <div className="mt-8 h-1 overflow-hidden w-full mx-auto bg-white gap-1 *:w-full rounded-full grid grid-cols-2">
        <div className={step === 1 ? "bg-primary h-full duration-500" : "bg-primary/30 h-full duration-500"}></div>
        <div className={step !== 1 ? "bg-primary h-full duration-500" : "bg-primary/30 h-full duration-500"}></div>
      </div>
    </div>
  )
}
