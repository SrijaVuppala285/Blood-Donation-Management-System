"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"

export default function FindDonorsPage() {
  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  const [bloodGroup, setBloodGroup] = useState("")
  const [pincode, setPincode] = useState("")
  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  const url = (() => {
    const params = new URLSearchParams()
    if (bloodGroup) params.set("bloodGroup", bloodGroup)
    if (pincode) params.set("pincode", pincode)
    const qs = params.toString()
    return `/api/users/search${qs ? `?${qs}` : ""}`
  })()

  const { data } = useSWR(
    auth?.token ? url : null,
    (u: string) => fetch(u, { headers: { Authorization: `Bearer ${auth?.token || ""}` } }).then((r) => r.json()),
    { keepPreviousData: true, refreshInterval: 15000 },
  )
  const donors = useMemo(() => data?.donors || [], [data])

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Find Donors</h1>
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <input
            className="h-10 rounded border px-3"
            placeholder="Blood Group (e.g., O+)"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
          <input
            className="h-10 rounded border px-3"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button
            className="h-10 rounded bg-gray-200 px-3 text-sm"
            onClick={() => {
              setBloodGroup("")
              setPincode("")
            }}
          >
            Clear
          </button>
        </div>
        <div className="grid gap-4">
          {donors.length === 0 && <p className="text-sm text-gray-600">No donors found.</p>}
          {donors.map((d: any) => (
            <div key={d.id} className="rounded border bg-white p-4">
              <h3 className="font-medium text-gray-900">{d.name}</h3>
              <p className="text-sm text-gray-600">
                {d.bloodGroup} • {d.pincode}
              </p>
              <p className="text-sm text-gray-600">
                Email: {d.email} • Mobile: {d.mobile}
              </p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
