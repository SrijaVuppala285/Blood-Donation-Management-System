import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="BloodConnect logo" width={24} height={24} className="h-6 w-6" />
              <span className="font-semibold text-red-600">BloodConnect</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Donate Blood. Save Lives. Build Community. Join campaigns, respond to emergencies, and earn recognition.
            </p>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-900">Product</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link className="hover:text-red-600" href="/campaigns">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-600" href="/donor/emergency">
                  Emergency
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-600" href="/recipient/find-donors">
                  Find Donors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-900">Company</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link className="hover:text-red-600" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-600" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-600" href="/profile">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-900">Get Started</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link className="hover:text-red-600" href="/signup">
                  Create Account
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-600" href="/login">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t pt-6 text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} BloodConnect</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-red-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-red-600">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
