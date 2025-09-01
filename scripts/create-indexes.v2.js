/* eslint-disable no-console */
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Sahithi"

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  // TTL for emergency requests already exists in create-indexes.js (requests.expiresAt)
  // Add TTL for campaigns.endsAt (auto-remove when over)
  await db.collection("campaigns").createIndex({ endsAt: 1 }, { expireAfterSeconds: 0 })
  console.log("Created TTL index on campaigns.endsAt")

  // Optional: clean notifications older than 30 days
  try {
    await db.collection("notifications").createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 })
    console.log("Created TTL index on notifications.createdAt (30d)")
  } catch (e) {
    console.log("Skipped notifications TTL:", e?.message)
  }

  await client.close()
  console.log("Done")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
