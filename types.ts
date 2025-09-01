export type Role = "donor" | "recipient"

export type User = {
  _id?: any
  name: string
  email: string
  passwordHash: string
  role: Role
  bloodGroup?: string
  pincode?: string
  mobile: string
  points: number
  badges: string[]
  createdAt: Date
  updatedAt: Date
}

export type RequestDoc = {
  _id?: any
  bloodGroup: string
  pincode: string
  status: "open" | "pending" | "accepted" | "expired"
  recipientId: string
  donorId?: string | null
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export type Campaign = {
  _id?: any
  title: string
  date: string // ISO date
  location: string
  points: number
  imageUrl?: string
  creatorId: string
  endsAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type Notification = {
  _id?: any
  userId: string
  type: "request" | "campaign" | "system"
  message: string
  read: boolean
  createdAt: Date
}
