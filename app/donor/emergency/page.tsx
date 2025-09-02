"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Countdown } from "@/components/countdown"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DonorEmergency() {
  const [pincode, setPincode] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const query = () => {
    const params = new URLSearchParams()
    if (pincode) params.set("pincode", pincode)
    if (bloodGroup) params.set("bloodGroup", bloodGroup)
    const qs = params.toString()
    return `/api/requests${qs ? `?${qs}` : ""}`
  }
  const { data, mutate } = useSWR(query, fetcher, { refreshInterval: 8000 })
  const list = useMemo(() => data?.requests || [], [data])

  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  async function volunteer(id: string) {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/requests/${id}/volunteer`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      mutate()
      alert("You volunteered. Recipient will be notified.")
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || "Failed")
    }
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900">Emergency Requests</h1>
        <p className="mb-3 text-sm text-gray-600">
          All open requests are shown by default. Use filters to narrow results.
        </p>
        <div className="mb-4 grid gap-2 md:grid-cols-3">
          <input
            className="h-10 rounded border px-3"
            placeholder="Filter by pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <input
            className="h-10 rounded border px-3"
            placeholder="Filter by blood group (e.g., O+)"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
          <button
            className="h-10 rounded bg-gray-200 px-3 text-sm"
            onClick={() => {
              setPincode("")
              setBloodGroup("")
            }}
          >
            Clear
          </button>
        </div>
        <div className="grid gap-4">
          {list.length === 0 && <p className="text-sm text-gray-600">No open requests at the moment.</p>}
          {list.map((r: any) => (
            <div key={r.id} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{r.bloodGroup}</h3>
                  <p className="text-sm text-gray-600">Pincode: {r.pincode}</p>
                  <p className="text-xs text-gray-500">
                    Expires in: <Countdown iso={r.expiresAt} />
                  </p>
                </div>
                <button
                  onClick={() => volunteer(r.id)}
                  className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                >
                  Volunteer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
