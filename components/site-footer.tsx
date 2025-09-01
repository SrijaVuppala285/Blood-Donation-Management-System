import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-red-600">BloodConnect</div>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">Pages</div>
          <ul className="space-y-1">
            <li>
              <Link href="/campaigns" className="text-muted-foreground hover:text-foreground">
                Campaigns
              </Link>
            </li>
            <li>
              <Link href="/donor/emergency" className="text-muted-foreground hover:text-foreground">
                Donor
              </Link>
            </li>
            <li>
              <Link href="/recipient/find-donors" className="text-muted-foreground hover:text-foreground">
                Recipients
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">Contact</div>
          <p className="text-muted-foreground">support@bloodconnect.example</p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-6">© {new Date().getFullYear()} BloodConnect</div>
    </footer>
  )
}
