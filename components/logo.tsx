import Image from "next/image"
export function Logo({ className }: { className?: string }) {
  return (
     <Image src="/images/logo.png" alt="Webdeves Logo" width={150} height={45} className={`w-auto ${className || ""}`} priority />
  )
}