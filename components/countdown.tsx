"use client"

import { useEffect, useMemo, useState } from "react"

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

export function Countdown({ iso }: { iso?: string }) {
  const target = useMemo(() => (iso ? new Date(iso).getTime() : undefined), [iso])
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!target) return null
  const remaining = target - now
  if (remaining <= 0) return <span className="text-xs font-medium text-muted-foreground">Expired</span>
  return <span className="text-xs font-medium text-green-600">{format(remaining)}</span>
}
