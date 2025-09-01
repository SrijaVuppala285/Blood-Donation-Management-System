import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <p>&copy; {new Date().getFullYear()} Sahithi</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-red-600">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-red-600">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  )
}
