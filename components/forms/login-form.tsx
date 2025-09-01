"use client"
import { useState } from "react"
import type React from "react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      localStorage.setItem("auth", JSON.stringify({ token: data.token, user: data.user }))
      window.location.href = data.user.role === "donor" ? "/donor" : "/recipient/requests"
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <input
          className="h-10 rounded border px-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Password</label>
        <input
          className="h-10 rounded border px-3"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        disabled={loading}
        className="w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
