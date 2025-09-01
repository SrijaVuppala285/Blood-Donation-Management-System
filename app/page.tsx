import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default async function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-semibold text-gray-900">Donate Blood, Save Lives</h1>
            <p className="text-pretty text-gray-600 leading-relaxed">
              Connect donors and recipients instantly. Join campaigns, respond to emergencies, and earn badges for your
              impact.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/signup" className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                Get Started
              </Link>
              <Link
                href="/campaigns"
                className="rounded border px-4 py-2 text-gray-800 hover:border-red-600 hover:text-red-600"
              >
                View Campaigns
              </Link>
            </div>
          </div>
          <div className="rounded border bg-white p-4">
            <h3 className="mb-2 font-medium text-gray-900">Upcoming Campaigns</h3>
            <p className="text-sm text-gray-600">Sign in to join and earn points.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
