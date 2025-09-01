import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongodb"
import { requireAuth } from "@/lib/api-helpers"
import type { User } from "@/types"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if ("error" in auth) return Response.json({ error: auth.error }, { status: auth.status })
  const db = await getDb()
  const users = db.collection<User>("users")
  const user = await users.findOne({ _id: new ObjectId(auth.user.sub) }, { projection: { passwordHash: 0 } })
  return Response.json({ user })
}
