import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import LoginForm from "@/components/forms/login-form"

export default function LoginPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Sign In</h1>
        <LoginForm />
      </section>
      <Footer />
    </main>
  )
}
