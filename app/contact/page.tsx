import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-3 text-2xl font-semibold text-gray-900">Contact Us</h1>
        <p className="text-gray-700 leading-relaxed">
          Reach out at support@sahithi.example for partnerships and campaigns.
        </p>
      </section>
      <Footer />
    </main>
  )
}
