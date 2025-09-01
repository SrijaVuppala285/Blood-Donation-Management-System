import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import { ObjectId } from "mongodb"
import type { Campaign, Notification, User } from "@/types"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ["donor", "recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const db = await getDb()
  const campaigns = db.collection<Campaign>("campaigns")
  const users = db.collection<User>("users")
  const notifications = db.collection<Notification>("notifications")
  const joins = db.collection("campaign_joins")

  const campaign = await campaigns.findOne({ _id: new ObjectId(params.id) })
  if (!campaign) return Response.json({ error: "Campaign not found" }, { status: 404 })

  // prevent duplicate joins; award points only once
  const res = await joins.updateOne(
    { campaignId: String(campaign._id), userId: auth.user.sub },
    { $setOnInsert: { campaignId: String(campaign._id), userId: auth.user.sub, createdAt: new Date() } },
    { upsert: true },
  )
  const newlyJoined = (res.upsertedId as any) || res.matchedCount === 0
  if (newlyJoined) {
    await users.updateOne({ _id: new ObjectId(auth.user.sub) }, { $inc: { points: campaign.points } })
  }

  await notifications.insertOne({
    userId: auth.user.sub,
    type: "campaign",
    message: `You joined ${campaign.title}`,
    read: false,
    createdAt: new Date(),
  })

  return Response.json({ ok: true, newlyJoined: Boolean(newlyJoined) })
}
