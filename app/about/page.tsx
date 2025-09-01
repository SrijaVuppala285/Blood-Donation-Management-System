import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-3 text-3xl font-semibold text-gray-900">About Us</h1>
        <p className="text-gray-700 leading-relaxed">
          Sahithi connects donors and recipients to make blood donation faster, safer, and more rewarding.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-semibold text-red-600">24/7</div>
            <div className="text-sm text-gray-600">Emergency support</div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-semibold text-red-600">Minutes</div>
            <div className="text-sm text-gray-600">to match volunteers</div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-semibold text-red-600">Community</div>
            <div className="text-sm text-gray-600">points & recognition</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
