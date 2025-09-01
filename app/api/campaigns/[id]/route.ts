import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { Campaign } from "@/types"

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  date: z.string().optional(),
  location: z.string().min(2).optional(),
  points: z.number().min(0).max(1000).optional(),
  imageUrl: z.string().url().optional(),
  durationDays: z.number().min(1).max(365).optional(),
  endsAt: z.string().optional(), // ISO
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ["donor", "recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")

  const current = await campaigns.findOne({ _id: new ObjectId(params.id) })
  if (!current) return Response.json({ error: "Campaign not found" }, { status: 404 })
  if (current.creatorId !== auth.user.sub) return Response.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const updates: any = { updatedAt: new Date() }
  for (const k of ["title", "date", "location", "points", "imageUrl"] as const) {
    if (parsed.data[k] !== undefined) updates[k] = parsed.data[k]
  }
  if (parsed.data.endsAt) {
    const e = new Date(parsed.data.endsAt)
    if (!isNaN(e.getTime())) updates.endsAt = e
  } else if (parsed.data.durationDays) {
    updates.endsAt = new Date(Date.now() + parsed.data.durationDays * 24 * 60 * 60 * 1000)
  }

  await campaigns.updateOne({ _id: new ObjectId(params.id) }, { $set: updates })
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ["donor", "recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")

  const current = await campaigns.findOne({ _id: new ObjectId(params.id) })
  if (!current) return Response.json({ error: "Campaign not found" }, { status: 404 })
  if (current.creatorId !== auth.user.sub) return Response.json({ error: "Forbidden" }, { status: 403 })

  await campaigns.deleteOne({ _id: new ObjectId(params.id) })
  return Response.json({ ok: true })
}
