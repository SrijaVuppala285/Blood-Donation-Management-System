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

  // update to pending and attach donorId
  await requests.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: "pending", donorId: auth.user.sub, updatedAt: new Date() } },
  )

  const donor = await users.findOne(
    { _id: new ObjectId(auth.user.sub) },
    { projection: { name: 1, email: 1, mobile: 1, bloodGroup: 1, pincode: 1 } as any },
  )

  await notifications.insertOne({
    userId: request.recipientId,
    type: "request",
    message: donor
      ? `Volunteer: ${donor.name} (${donor.bloodGroup}) • ${donor.mobile} • ${donor.email} • ${donor.pincode}`
      : "A donor volunteered for your request.",
    read: false,
    createdAt: new Date(),
  })

  // award points immediately upon volunteering (preserve existing behavior)
  await users.updateOne({ _id: new ObjectId(auth.user.sub) }, { $inc: { points: 10 } })

  return Response.json({ ok: true })
}
