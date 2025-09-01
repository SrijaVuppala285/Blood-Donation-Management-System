import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./jwt"

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function json(data: any, init = 200) {
  return NextResponse.json(data, { status: init })
}

export function getBearer(req: NextRequest) {
  const header = req.headers.get("authorization") || ""
  const [, token] = header.split(" ")
  return token || null
}

export function requireAuth(req: NextRequest, allowed?: Array<"donor" | "recipient">) {
  const token = getBearer(req)
  if (!token) return { error: "Unauthorized", status: 401 as const }
  const payload = verifyToken(token)
  if (!payload) return { error: "Invalid token", status: 401 as const }
  if (allowed && !allowed.includes(payload.role)) {
    return { error: "Forbidden", status: 403 as const }
  }
  return { user: payload, status: 200 as const }
}
