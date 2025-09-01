import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { Notification } from "@/types"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ["donor", "recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })

  const db = await getDb()
  const notifications = db.collection<Notification>("notifications")

  const docs = await notifications.find({ userId: auth.user.sub }).sort({ createdAt: -1 }).limit(50).toArray()

  return Response.json({
    notifications: docs.map((n) => ({ ...n, id: String((n as any)._id) })),
  })
}

const patchSchema = z.union([
  z.object({
    ids: z.array(z.string().min(1)).min(1),
    read: z.boolean().default(true),
  }),
  z.object({
    markAllRead: z.literal(true),
  }),
])

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req, ["donor", "recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const db = await getDb()
  const notifications = db.collection<Notification>("notifications")

  if ("markAllRead" in parsed.data && parsed.data.markAllRead) {
    const res = await notifications.updateMany({ userId: auth.user.sub, read: false }, { $set: { read: true } })
    return Response.json({ modified: res.modifiedCount })
  } else {
    const ids = parsed.data.ids.map((id) => new ObjectId(id))
    const res = await notifications.updateMany(
      { _id: { $in: ids }, userId: auth.user.sub },
      { $set: { read: parsed.data.read } },
    )
    return Response.json({ modified: res.modifiedCount })
  }
}
