"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Home, LogOut, MessageSquare, Settings, Truck, Users } from "lucide-react"

interface AdminSidebarProps {
  activePage: string
}

export function AdminSidebar({ activePage }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, this would handle proper logout
    router.push("/admin")
  }

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "inventory",
      label: "Inventory",
      href: "/admin/inventory",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "inquiries",
      label: "Inquiries",
      href: "/admin/inquiries",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: "customers",
      label: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "reports",
      label: "Reports",
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "documents",
      label: "Documents",
      href: "/admin/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Truck className="h-6 w-6" />
            <span>Triple B Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activePage === item.id
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
