import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SignupForm from "@/components/forms/signup-form"

export default function SignupPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Create your account</h1>
        <SignupForm />
      </section>
      <Footer />
    </main>
  )
}
