import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    // optional ping — ensures the connection is alive
    // @ts-ignore - Db.command exists in the official driver
    await db.command({ ping: 1 })

    return Response.json({
      ok: true,
      message: "Database connection OK",
      time: new Date().toISOString(),
    })
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message || "DB connection failed" }, { status: 500 })
  }
}
