import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { RequestDoc, Notification, User } from "@/types"

const createSchema = z.object({
  bloodGroup: z.string(),
  pincode: z.string(),
  // expires in minutes from now
  expiresInMins: z
    .number()
    .min(5)
    .max(24 * 60),
})

export async function GET(req: NextRequest) {
  const db = await getDb()
  const requests = db.collection<RequestDoc>("requests")
  const { searchParams } = new URL(req.url)
  const pincode = searchParams.get("pincode") || undefined
  const now = new Date()
  const query: any = { status: "open", expiresAt: { $gt: now } }
  if (pincode) query.pincode = pincode
  const data = await requests.find(query).sort({ createdAt: -1 }).limit(50).toArray()
  return Response.json({ requests: data.map((r) => ({ ...r, id: String(r._id) })) })
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ["recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  const { bloodGroup, pincode, expiresInMins } = parsed.data

  const db = await getDb()
  const requests = db.collection<RequestDoc>("requests")
  const users = db.collection<User>("users")
  const notifications = db.collection<Notification>("notifications")

  const expiresAt = new Date(Date.now() + expiresInMins * 60 * 1000)
  const doc: RequestDoc = {
    bloodGroup,
    pincode,
    status: "open",
    recipientId: auth.user.sub,
    donorId: null,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const { insertedId } = await requests.insertOne(doc)

  // Notify donors in same pincode and bloodGroup
  const targetDonors = await users.find({ role: "donor", pincode, bloodGroup }).project({ _id: 1 }).toArray()

  if (targetDonors.length) {
    const notifs = targetDonors.map((d) => ({
      userId: String(d._id),
      type: "request" as const,
      message: `Emergency request for ${bloodGroup} in ${pincode}`,
      read: false,
      createdAt: new Date(),
    }))
    await notifications.insertMany(notifs)
  }

  return Response.json({ id: String(insertedId) }, { status: 201 })
}
