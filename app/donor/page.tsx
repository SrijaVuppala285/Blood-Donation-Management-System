"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"

const fetcher = (url: string) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}")
  return fetch(url, { headers: { Authorization: `Bearer ${auth.token || ""}` } }).then((r) => r.json())
}

export default function DonorDashboard() {
  const { data } = useSWR("/api/auth/me", fetcher)
  const user = data?.user

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Welcome{user ? `, ${user.name}` : ""}</h1>
        <p className="text-gray-700">
          Points: <span className="font-semibold text-emerald-600">{user?.points ?? 0}</span>
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a href="/donor/emergency" className="rounded border bg-white p-4 hover:border-red-600 hover:shadow">
            <h3 className="font-medium text-gray-900">Emergency Requests</h3>
            <p className="text-sm text-gray-600">See open requests near you.</p>
          </a>
          <a href="/campaigns" className="rounded border bg-white p-4 hover:border-red-600 hover:shadow">
            <h3 className="font-medium text-gray-900">Campaigns</h3>
            <p className="text-sm text-gray-600">Join campaigns to earn more points.</p>
          </a>
        </div>
      </section>
      <Footer />
    </main>
  )
}
