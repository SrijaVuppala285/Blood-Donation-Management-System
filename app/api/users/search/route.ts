import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { User } from "@/types"

const schema = z.object({
  bloodGroup: z.string(),
  pincode: z.string(),
})

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ["recipient"])
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const { searchParams } = new URL(req.url)
  const params = schema.safeParse({
    bloodGroup: searchParams.get("bloodGroup"),
    pincode: searchParams.get("pincode"),
  })
  if (!params.success) return Response.json({ error: params.error.flatten() }, { status: 400 })

  const db = await getDb()
  const users = db.collection<User>("users")
  const donors = await users
    .find({ role: "donor", bloodGroup: params.data.bloodGroup, pincode: params.data.pincode })
    .project({ passwordHash: 0 })
    .limit(50)
    .toArray()
  return Response.json({ donors: donors.map((d) => ({ ...d, id: String(d._id) })) })
}
