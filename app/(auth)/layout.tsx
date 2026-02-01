import type React from "react"
import Image from "next/image"
import { Logo } from "@/components/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-12">
        <div className="mb-12">
          <Logo />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#2D1B3D]">
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <Image src="/images/banner.png" alt="Webdeves Academy classroom" fill className="object-cover" priority />
          <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#2D1B3D] via-[#2D1B3D]/80 to-transparent">
            <h2 className="text-white text-2xl font-bold mb-3">Webdeves Academy</h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Empowering the next generation of tech professionals through quality education and hands-on training.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
