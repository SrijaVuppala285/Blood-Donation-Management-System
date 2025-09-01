import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export type JwtPayload = {
  sub: string
  email: string
  role: "donor" | "recipient"
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}
