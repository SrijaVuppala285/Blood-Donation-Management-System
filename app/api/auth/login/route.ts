import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { comparePassword } from "@/lib/api-helpers"
import { signToken } from "@/lib/jwt"
import type { User } from "@/types"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const { email, password } = parsed.data
  const db = await getDb()
  const users = db.collection<User>("users")
  const user = await users.findOne({ email })
  if (!user) return Response.json({ error: "Invalid credentials" }, { status: 401 })

  const ok = await comparePassword(password, user.passwordHash)
  if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401 })

  const token = signToken({ sub: String(user._id), email, role: user.role })
  return Response.json({ token, user: { id: String(user._id), name: user.name, email, role: user.role } })
}
