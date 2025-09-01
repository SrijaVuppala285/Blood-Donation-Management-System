"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import useSWR from "swr"

const fetcher = (url: string) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}")
  return fetch(url, { headers: { Authorization: `Bearer ${auth.token || ""}` } }).then((r) => r.json())
}

export default function ProfilePage() {
  const { data } = useSWR("/api/auth/me", fetcher)
  const user = data?.user

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900">Your Profile</h1>
        {!user ? (
          <p className="text-gray-600">Please login to view your profile.</p>
        ) : (
          <div className="rounded-lg border bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-gray-800">
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Role:</span> {user.role}
                </p>
              </div>
              <div className="rounded bg-emerald-50 px-3 py-2 text-emerald-700">
                <div className="text-xs">Points</div>
                <div className="text-xl font-semibold">{user.points}</div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium text-gray-800">Badges</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(user.badges || []).length === 0 && <span className="text-sm text-gray-500">No badges yet.</span>}
                {(user.badges || []).map((b: string) => (
                  <span key={b} className="rounded bg-gray-100 px-2 py-1 text-xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
