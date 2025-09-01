import type { NextRequest } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/mongodb"
import { hashPassword } from "@/lib/api-helpers"
import { signToken } from "@/lib/jwt"
import type { User } from "@/types"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["donor", "recipient"]),
  bloodGroup: z.string().optional(),
  pincode: z.string().optional(),
  mobile: z.string().min(8),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { name, email, password, role, bloodGroup, pincode, mobile } = parsed.data
  const db = await getDb()
  const users = db.collection<User>("users")

  const exists = await users.findOne({ $or: [{ email }, { mobile }] })
  if (exists) {
    return Response.json({ error: "Email or mobile already registered" }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const user: User = {
    name,
    email,
    passwordHash,
    role,
    bloodGroup,
    pincode,
    mobile,
    points: 0,
    badges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const { insertedId } = await users.insertOne(user)

  const token = signToken({ sub: String(insertedId), email, role })
  return Response.json({ token, user: { id: String(insertedId), name, email, role } }, { status: 201 })
}
