"use client"
import Navbar from "@/components/navbar"
import type React from "react"

import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"

type AuthState = { token?: string; user?: { sub?: string } }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function parseJwtSub(token?: string): string | null {
  if (!token) return null
  try {
    const base = token.split(".")[1]
    const json = JSON.parse(atob(base))
    return json.sub || null
  } catch {
    return null
  }
}

function formatRemaining(to?: string | Date) {
  if (!to) return "—"
  const end = new Date(to).getTime()
  const now = Date.now()
  let diff = Math.max(0, end - now)
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  diff -= days * 24 * 60 * 60 * 1000
  const hours = Math.floor(diff / (60 * 60 * 1000))
  diff -= hours * 60 * 60 * 1000
  const mins = Math.floor(diff / (60 * 1000))
  return `${days}d ${hours}h ${mins}m`
}

export default function CampaignsPage() {
  const { data, mutate } = useSWR("/api/campaigns", fetcher, { refreshInterval: 15000 })
  const list = useMemo(() => data?.campaigns || [], [data])

  const [auth, setAuth] = useState<AuthState | null>(null)
  const [creatorSub, setCreatorSub] = useState<string | null>(null)
  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) {
      const a = JSON.parse(raw)
      setAuth(a)
      setCreatorSub(parseJwtSub(a.token))
    }
  }, [])

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    points: 10,
    imageUrl: "",
    durationDays: 7,
  })
  const [editId, setEditId] = useState<string | null>(null)

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault()
    if (!auth?.token) return alert("Please login")
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: "", date: "", location: "", points: 10, imageUrl: "", durationDays: 7 })
      mutate()
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error ? JSON.stringify(d.error) : "Failed to create")
    }
  }

  async function joinCampaign(id: string) {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/campaigns/${id}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      mutate()
      alert("Joined campaign!")
    } else {
      alert("Failed to join")
    }
  }

  async function deleteCampaign(id: string) {
    if (!auth?.token) return alert("Please login")
    if (!confirm("Delete this campaign?")) return
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return alert(d.error || "Delete failed")
    }
    mutate()
  }

  async function saveEdit(id: string, payload: any) {
    if (!auth?.token) return alert("Please login")
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return alert(d.error || "Update failed")
    }
    setEditId(null)
    mutate()
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 text-balance">Campaigns</h1>

        <form onSubmit={createCampaign} className="mb-8 grid gap-3 md:grid-cols-6">
          <input
            className="h-10 rounded border px-3 md:col-span-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="h-10 rounded border px-3 md:col-span-2"
            type="datetime-local"
            placeholder="Date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <input
            className="h-10 rounded border px-3 md:col-span-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <input
            className="h-10 rounded border px-3 md:col-span-2"
            type="number"
            min={0}
            max={1000}
            placeholder="Points"
            value={form.points}
            onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
          />
          <input
            className="h-10 rounded border px-3 md:col-span-2"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <input
            className="h-10 rounded border px-3 md:col-span-1"
            type="number"
            min={1}
            max={365}
            placeholder="Duration (days)"
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
          />
          <button className="h-10 rounded bg-red-600 px-4 text-white hover:bg-red-700 md:col-span-1">Create</button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {list.length === 0 && <p className="text-gray-600 text-sm">No campaigns yet.</p>}
          {list.map((c: any) => {
            const isOwner = creatorSub && c.creatorId === creatorSub
            const remaining = formatRemaining(c.endsAt)
            return (
              <div key={c.id} className="rounded border bg-white">
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl || "/placeholder.svg"}
                    alt={c.title}
                    className="h-40 w-full rounded-t object-cover"
                  />
                ) : (
                  <div className="h-40 w-full rounded-t bg-gray-100" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{c.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(c.date).toLocaleString()} • {c.location}
                      </p>
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">{c.points} pts</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Ends in: {remaining}</div>

                  {editId === c.id && isOwner ? (
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <input
                        className="h-9 rounded border px-2"
                        defaultValue={c.title}
                        onChange={(e) => (c.title = e.target.value)}
                      />
                      <input
                        className="h-9 rounded border px-2"
                        type="datetime-local"
                        defaultValue={c.date?.slice(0, 16)}
                        onChange={(e) => (c.date = e.target.value)}
                      />
                      <input
                        className="h-9 rounded border px-2"
                        defaultValue={c.location}
                        onChange={(e) => (c.location = e.target.value)}
                      />
                      <input
                        className="h-9 rounded border px-2"
                        type="number"
                        min={0}
                        max={1000}
                        defaultValue={c.points}
                        onChange={(e) => (c.points = Number(e.target.value))}
                      />
                      <input
                        className="h-9 rounded border px-2 md:col-span-2"
                        placeholder="Image URL"
                        defaultValue={c.imageUrl || ""}
                        onChange={(e) => (c.imageUrl = e.target.value)}
                      />
                      <input
                        className="h-9 rounded border px-2"
                        type="number"
                        min={1}
                        max={365}
                        placeholder="Duration (days)"
                        onChange={(e) => (c.durationDays = Number(e.target.value))}
                      />
                      <div className="flex gap-2 md:col-span-2">
                        <button className="rounded bg-gray-200 px-3 py-1 text-sm" onClick={() => setEditId(null)}>
                          Cancel
                        </button>
                        <button
                          className="rounded bg-emerald-600 px-3 py-1 text-sm text-white"
                          onClick={() =>
                            saveEdit(c.id, {
                              title: c.title,
                              date: c.date,
                              location: c.location,
                              points: c.points,
                              imageUrl: c.imageUrl,
                              durationDays: c.durationDays,
                            })
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                        onClick={() => joinCampaign(c.id)}
                      >
                        Join
                      </button>
                      {isOwner && (
                        <>
                          <button
                            className="rounded bg-gray-200 px-3 py-1.5 text-gray-800"
                            onClick={() => setEditId(c.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded bg-gray-200 px-3 py-1.5 text-gray-800"
                            onClick={() => deleteCampaign(c.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <Footer />
    </main>
  )
}
