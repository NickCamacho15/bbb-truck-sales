import Link from "next/link"
import { Truck, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6" />
              <span className="font-bold text-xl">Triple B Truck Sales</span>
            </Link>
            <p className="mb-4">
              Your trusted source for medium and light duty work trucks. Family owned and operated since 2005.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-blue-400">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/financing" className="hover:text-blue-400">
                  Financing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Truck Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/inventory?category=pickups" className="hover:text-blue-400">
                  Pickup Trucks
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=dump-trucks" className="hover:text-blue-400">
                  Dump Trucks
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=safety-trucks" className="hover:text-blue-400">
                  Safety Trucks
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=box-trucks" className="hover:text-blue-400">
                  Box Trucks
                </Link>
              </li>
              <li>
                <Link href="/inventory?category=flatbed-trucks" className="hover:text-blue-400">
                  Flatbed Trucks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>
                  123 Truck Lane
                  <br />
                  Dallas, TX 75001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@bbbtrucksales.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BBB Truck Sales. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-400">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-blue-400">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
