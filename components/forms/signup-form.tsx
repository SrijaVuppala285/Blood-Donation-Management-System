"use client"
import { useState } from "react"
import type React from "react"

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    bloodGroup: "",
    pincode: "",
    mobile: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")
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
        <label className="text-sm">Name</label>
        <input
          className="h-10 rounded border px-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <input
          className="h-10 rounded border px-3"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Password</label>
        <input
          className="h-10 rounded border px-3"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Role</label>
        <select
          className="h-10 rounded border px-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="donor">Donor</option>
          <option value="recipient">Recipient</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Blood Group (Donors)</label>
        <input
          className="h-10 rounded border px-3"
          value={form.bloodGroup}
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          placeholder="e.g., O+, A-"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Pincode</label>
        <input
          className="h-10 rounded border px-3"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Mobile</label>
        <input
          className="h-10 rounded border px-3"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          required
        />
      </div>
      <button
        disabled={loading}
        className="w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}
