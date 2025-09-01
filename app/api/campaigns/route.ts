import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { Campaign } from "@/types"

const createSchema = z.object({
  title: z.string().min(2),
  date: z.string(), // ISO
  location: z.string().min(2),
  points: z.number().min(0).max(1000),
  imageUrl: z.string().url().optional(),
  durationDays: z.number().min(1).max(365).optional(),
  endsAt: z.string().optional(), // ISO (optional override)
})

export async function GET() {
  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")
  const now = new Date()
  const list = await campaigns
    .find({
      $or: [{ endsAt: { $exists: false } }, { endsAt: { $gt: now } }],
    })
    .sort({ endsAt: 1, date: 1 })
    .limit(100)
    .toArray()
  return Response.json({
    campaigns: list.map((c) => ({
      ...c,
      id: String(c._id),
    })),
  })
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["donor", "recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")
  const now = new Date()

  let endsAt: Date | undefined
  if (parsed.data.endsAt) {
    const e = new Date(parsed.data.endsAt)
    if (!isNaN(e.getTime())) endsAt = e
  } else if (parsed.data.durationDays) {
    endsAt = new Date(Date.now() + parsed.data.durationDays * 24 * 60 * 60 * 1000)
  }

  const doc: Campaign = {
    title: parsed.data.title,
    date: parsed.data.date,
    location: parsed.data.location,
    points: parsed.data.points,
    imageUrl: parsed.data.imageUrl,
    creatorId: auth.user.sub,
    endsAt,
    createdAt: now,
    updatedAt: now,
  }

  const { insertedId } = await campaigns.insertOne(doc)
  return Response.json({ id: String(insertedId) }, { status: 201 })
}
