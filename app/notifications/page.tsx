"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"

type Notif = {
  id: string
  type: "request" | "campaign" | string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [auth, setAuth] = useState<{ token?: string } | null>(null)
  useEffect(() => {
    const raw = localStorage.getItem("auth")
    if (raw) setAuth(JSON.parse(raw))
  }, [])

  const { data, mutate, isLoading } = useSWR(
    auth?.token ? "/api/notifications" : null,
    (url: string) => fetch(url, { headers: { Authorization: `Bearer ${auth?.token || ""}` } }).then((r) => r.json()),
    { refreshInterval: 10000 },
  )

  const notifications: Notif[] = useMemo(() => data?.notifications || [], [data])
  const unreadCount = notifications.filter((n) => !n.read).length

  async function markAllRead() {
    if (!auth?.token) return
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ markAllRead: true }),
    })
    if (res.ok) mutate()
  }

  async function markSelected(ids: string[], read: boolean) {
    if (!auth?.token) return
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ ids, read }),
    })
    if (res.ok) mutate()
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Unread: {unreadCount}</span>
            <button
              onClick={markAllRead}
              className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={!auth?.token || unreadCount === 0}
            >
              Mark all read
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {isLoading && <p className="text-sm text-gray-600">Loading...</p>}
          {!isLoading && notifications.length === 0 && <p className="text-sm text-gray-600">No notifications yet.</p>}
          {notifications.map((n) => (
            <div key={n.id} className={`rounded border bg-white p-4 ${n.read ? "opacity-80" : ""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{n.message}</p>
                  <p className="text-xs text-gray-600">
                    {n.type} • {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!n.read ? (
                    <button
                      onClick={() => markSelected([n.id], true)}
                      className="rounded border px-2 py-1 text-sm hover:border-red-600 hover:text-red-600"
                    >
                      Mark read
                    </button>
                  ) : (
                    <button
                      onClick={() => markSelected([n.id], false)}
                      className="rounded border px-2 py-1 text-sm hover:border-red-600 hover:text-red-600"
                    >
                      Mark unread
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
