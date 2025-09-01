"use client"
import Navbar from "@/components/navbar"
import type React from "react"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Countdown } from "@/components/countdown"

const fetcherWithAuth = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())

export default function RecipientRequestsPage() {
  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  const [form, setForm] = useState({ bloodGroup: "", pincode: "", expiresInMins: 120 })

  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  const { data, mutate } = useSWR(
    auth?.token ? "/api/requests?mine=1" : null,
    (u) => fetcherWithAuth(u, auth?.token || ""),
    {
      refreshInterval: 8000,
    },
  )
  const list = useMemo(() => data?.requests || [], [data])

  async function createRequest(e: React.FormEvent) {
    e.preventDefault()
    if (!auth?.token) return alert("Please login")
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ bloodGroup: "", pincode: "", expiresInMins: 120 })
      mutate()
      alert("Request created and donors notified.")
    } else {
      const d = await res.json()
      alert(d.error || "Failed")
    }
  }

  async function decide(id: string, decision: "accept" | "reject") {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/requests/${id}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ decision }),
    })
    if (res.ok) {
      mutate()
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || "Action failed")
    }
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900">Emergency Requests</h1>
        <form onSubmit={createRequest} className="mb-6 grid gap-3 md:grid-cols-4">
          <input
            className="h-10 rounded border px-3"
            placeholder="Blood Group"
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            required
          />
          <input
            className="h-10 rounded border px-3"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            required
          />
          <input
            className="h-10 rounded border px-3"
            type="number"
            min={5}
            max={1440}
            placeholder="Expires (mins)"
            value={form.expiresInMins}
            onChange={(e) => setForm({ ...form, expiresInMins: Number(e.target.value) })}
          />
          <button className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700">Create Request</button>
        </form>
        <div className="grid gap-4">
          {list.length === 0 && <p className="text-sm text-gray-600">No requests yet.</p>}
          {list.map((r: any) => (
            <div key={r.id} className="rounded border bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{r.bloodGroup}</h3>
                  <p className="text-sm text-gray-600">
                    Pincode: {r.pincode} • Status: {r.status}
                  </p>
                  <span className="text-xs text-gray-500">
                    Expires in: <Countdown iso={r.expiresAt} />
                  </span>
                  {r.donor && (
                    <div className="mt-2 rounded border bg-gray-50 p-2 text-sm text-gray-700">
                      <p className="font-medium">Volunteer details</p>
                      <p>
                        {r.donor.name} • {r.donor.bloodGroup}
                      </p>
                      <p>
                        {r.donor.mobile} • {r.donor.email} • {r.donor.pincode}
                      </p>
                    </div>
                  )}
                </div>
                {r.status === "pending" && (
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      onClick={() => decide(r.id, "accept")}
                      className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => decide(r.id, "reject")}
                      className="rounded bg-gray-200 px-3 py-1.5 text-gray-800"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
