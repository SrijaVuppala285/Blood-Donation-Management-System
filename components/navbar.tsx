"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

type UserLite = { id: string; name: string; email: string; role: "donor" | "recipient" } | null

export default function Navbar() {
  const [user, setUser] = useState<UserLite>(null)

  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setUser(parsed.user)
      } catch {}
    }
  }, [])

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-red-600">
          Sahithi
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/campaigns" className="text-sm text-gray-700 hover:text-red-600">
            Campaigns
          </Link>
          <Link href="/about" className="text-sm text-gray-700 hover:text-red-600">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-700 hover:text-red-600">
            Contact
          </Link>
          {user ? (
            <>
              {user.role === "donor" ? (
                <>
                  <Link href="/donor" className="text-sm text-gray-700 hover:text-red-600">
                    Donor
                  </Link>
                  <Link href="/donor/emergency" className="text-sm text-gray-700 hover:text-red-600">
                    Emergency
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/recipient/find-donors" className="text-sm text-gray-700 hover:text-red-600">
                    Find Donors
                  </Link>
                  <Link href="/recipient/requests" className="text-sm text-gray-700 hover:text-red-600">
                    Requests
                  </Link>
                </>
              )}
              <Link href="/profile" className="text-sm text-gray-700 hover:text-red-600">
                Profile
              </Link>
              <button
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                onClick={() => {
                  localStorage.removeItem("auth")
                  window.location.href = "/"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-red-600">
                Login
              </Link>
              <Link href="/signup" className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
