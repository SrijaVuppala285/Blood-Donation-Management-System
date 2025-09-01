"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useMemo } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CampaignsPage() {
  const { data } = useSWR("/api/campaigns", fetcher)
  const list = useMemo(() => data?.campaigns || [], [data])

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Campaigns</h1>
        <div className="grid gap-4">
          {list.length === 0 && <p className="text-gray-600 text-sm">No campaigns yet.</p>}
          {list.map((c: any) => (
            <div key={c.id} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600">
                    {c.date} • {c.location}
                  </p>
                </div>
                <span className="text-sm text-emerald-600 font-medium">{c.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
