import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-3 text-3xl font-semibold text-gray-900">Contact Us</h1>
        <p className="mb-6 leading-relaxed text-gray-700">
          For partnerships and campaign inquiries, contact our team at support@bloodconnect.example.
        </p>
        <form className="grid gap-3">
          <input className="h-11 rounded border px-3" placeholder="Your name" />
          <input className="h-11 rounded border px-3" placeholder="Your email" type="email" />
          <textarea className="min-h-28 rounded border px-3 py-2" placeholder="How can we help?" />
          <button className="h-11 w-fit rounded bg-red-600 px-4 text-white hover:bg-red-700">Send message</button>
        </form>
      </section>
      <Footer />
    </main>
  )
}
