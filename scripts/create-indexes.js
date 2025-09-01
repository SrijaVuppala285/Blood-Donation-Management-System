// Run this locally (Node) to prepare indexes: node scripts/create-indexes.js
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Sahithi"

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  // Unique on email and mobile (fake donor detection)
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ mobile: 1 }, { unique: true })

  // Requests TTL auto-expiry (expire 0 seconds after expiresAt)
  await db.collection("requests").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

  // Useful lookups
  await db.collection("users").createIndex({ role: 1, pincode: 1, bloodGroup: 1 })
  await db.collection("campaigns").createIndex({ date: 1 })

  console.log("Indexes created.")
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
