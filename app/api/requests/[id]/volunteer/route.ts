import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { Notification, RequestDoc, User } from "@/types"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ["donor"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const db = await getDb()
  const requests = db.collection<RequestDoc>("requests")
  const notifications = db.collection<Notification>("notifications")
  const users = db.collection<User>("users")

  const request = await requests.findOne({ _id: new ObjectId(params.id) })
  if (!request || request.status !== "open" || request.expiresAt <= new Date()) {
    return Response.json({ error: "Request not available" }, { status: 400 })
  }

  await requests.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: "accepted", donorId: auth.user.sub, updatedAt: new Date() } },
  )

  // Notify recipient
  await notifications.insertOne({
    userId: request.recipientId,
    type: "request",
    message: "A donor volunteered for your request.",
    read: false,
    createdAt: new Date(),
  })

  // Award points to donor
  await users.updateOne({ _id: new ObjectId(auth.user.sub) }, { $inc: { points: 10 } })

  return Response.json({ ok: true })
}
