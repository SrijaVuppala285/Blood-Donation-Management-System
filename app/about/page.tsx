import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-3 text-2xl font-semibold text-gray-900">About Us</h1>
        <p className="text-gray-700 leading-relaxed">
          Sahithi connects donors and recipients to make blood donation faster, safer, and more rewarding.
        </p>
      </section>
      <Footer />
    </main>
  )
}
