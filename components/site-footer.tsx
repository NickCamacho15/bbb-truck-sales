"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Truck, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  const pathname = usePathname()
  const isAdminLoginPage = pathname === '/admin'
  
  // Hide footer on admin login page
  if (isAdminLoginPage) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-start md:justify-self-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6" />
              <span className="font-bold text-xl">Triple B Truck Sales</span>
            </Link>
            <p className="mb-6">
              Your trusted source for medium and light duty work trucks. Family owned and operated since 2005.
            </p>
          </div>

          <div className="flex flex-col items-center md:justify-self-center text-center">
            <h3 className="font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-blue-400 transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end md:justify-self-end">
            <h3 className="font-semibold text-lg mb-5 md:text-right w-full">Contact Us</h3>
            <ul className="space-y-4 md:text-right">
              <li className="flex items-start gap-3 md:flex-row-reverse">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>
                  123 Truck Lane
                  <br />
                  Dallas, TX 75001
                </span>
              </li>
              <li className="flex items-center gap-3 md:flex-row-reverse">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 md:flex-row-reverse">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@bbbtrucksales.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2025 BBB Truck Sales. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
