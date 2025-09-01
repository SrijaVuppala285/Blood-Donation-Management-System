"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/donor/emergency", label: "Donor" },
  { href: "/recipient/find-donors", label: "Recipients" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/profile", label: "Profile" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="border-b bg-white/70 dark:bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold text-red-600">
          BloodConnect
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                pathname === item.href && "text-foreground font-medium",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
