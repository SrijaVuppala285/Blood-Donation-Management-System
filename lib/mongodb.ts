import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Sahithi"

// reuse client across hot reloads in dev
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export async function getDb() {
  if (!clientPromise) {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  }
  const cli = await clientPromise
  return cli.db() // default DB from URI
}
