import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { User } from "@/types"

const schema = z.object({
  bloodGroup: z.string().optional(),
  pincode: z.string().optional(),
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

  // Build query dynamically; show all donors if no filters provided
  const query: any = { role: "donor" }
  if (params.data.bloodGroup) query.bloodGroup = params.data.bloodGroup
  if (params.data.pincode) query.pincode = params.data.pincode

  const donors = await users.find(query).project({ passwordHash: 0 }).limit(100).toArray()

  return Response.json({
    donors: donors.map((d) => ({ ...d, id: String(d._id) })),
  })
}
