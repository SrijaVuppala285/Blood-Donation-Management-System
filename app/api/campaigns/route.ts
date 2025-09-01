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
})

export async function GET() {
  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")
  const list = await campaigns.find({}).sort({ date: 1 }).toArray()
  return Response.json({ campaigns: list.map((c) => ({ ...c, id: String(c._id) })) })
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req) // allow both roles to propose for MVP
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")
  const now = new Date()
  const { insertedId } = await campaigns.insertOne({ ...parsed.data, createdAt: now, updatedAt: now })
  return Response.json({ id: String(insertedId) }, { status: 201 })
}
