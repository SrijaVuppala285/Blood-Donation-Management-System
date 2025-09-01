import type { NextRequest } from "next/server"
import { z } from "zod"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { Notification, RequestDoc, User } from "@/types"

const schema = z.object({
  decision: z.enum(["accept", "reject"]),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ["recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const db = await getDb()
  const requests = db.collection<RequestDoc>("requests")
  const users = db.collection<User>("users")
  const notifications = db.collection<Notification>("notifications")

  const reqDoc = await requests.findOne({ _id: new ObjectId(params.id) })
  if (!reqDoc || reqDoc.recipientId !== auth.user.sub) return Response.json({ error: "Not found" }, { status: 404 })
  if (reqDoc.status !== "pending" || !reqDoc.donorId) {
    return Response.json({ error: "No pending volunteer to decide" }, { status: 400 })
  }

  if (parsed.data.decision === "accept") {
    await requests.updateOne({ _id: new ObjectId(params.id) }, { $set: { status: "accepted", updatedAt: new Date() } })
    await notifications.insertOne({
      userId: reqDoc.donorId!,
      type: "request",
      message: "Your volunteer offer was accepted by the recipient.",
      read: false,
      createdAt: new Date(),
    })
    return Response.json({ ok: true })
  } else {
    // reject -> revert to open
    await requests.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: "open", donorId: null, updatedAt: new Date() } },
    )
    await notifications.insertOne({
      userId: reqDoc.donorId!,
      type: "request",
      message: "Your volunteer offer was rejected by the recipient.",
      read: false,
      createdAt: new Date(),
    })
    return Response.json({ ok: true })
  }
}
