import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default async function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-gray-900">
              Donate Blood. Save Lives. Build Community.
            </h1>
            <p className="text-pretty text-gray-600 leading-relaxed">
              Join time-bound campaigns, respond to emergency requests, and earn recognition for your impact.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                Get Started
              </Link>
              <Link
                href="/campaigns"
                className="rounded border px-4 py-2 text-gray-800 hover:border-red-600 hover:text-red-600"
              >
                Explore Campaigns
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-gray-900">How it works</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Create or join campaigns and earn points</li>
              <li>• Recipients post emergency requests with expiry times</li>
              <li>• Donors volunteer and get notified instantly</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-5">
            <h4 className="font-medium text-gray-900">Verified Donors</h4>
            <p className="text-sm text-gray-600">Filter by blood group and pincode to find the right donor quickly.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h4 className="font-medium text-gray-900">Time-bound Requests</h4>
            <p className="text-sm text-gray-600">Requests auto-expire with clear timers to avoid stale data.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h4 className="font-medium text-gray-900">Points & Badges</h4>
            <p className="text-sm text-gray-600">Contributions are rewarded and showcased in your profile.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
