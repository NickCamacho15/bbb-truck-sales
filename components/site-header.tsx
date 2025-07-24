"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { 
  Menu, 
  Truck, 
  Phone, 
  Bell, 
  User, 
  Home, 
  MessageSquare, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react"
import { clickable } from "@/lib/utils"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin') || false
  const isAdminLoginPage = pathname === '/admin'
  
  // Hide header on admin login page
  if (isAdminLoginPage) {
    return null
  }

  // Admin navigation items
  const adminNavItems = [
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
      id: "reports",
      label: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    }
  ]

  const handleMobileMenuItemClick = (href: string) => {
    setIsOpen(false)
    // Allow the navigation to happen after the menu closes
    // setTimeout(() => {
    //   router.push(href)
    // }, 200)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <div className={cn(
        "flex h-16 items-center justify-between",
        isAdminPage ? "mx-4" : "mx-4"
      )}>
        <div className="flex items-center">
          <Link href={isAdminPage ? "/admin/dashboard" : "/"} className="flex items-center gap-2 mr-6">
            <Truck className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">
              {isAdminPage ? "Triple B Admin" : "Triple B Truck Sales"}
            </span>
            <span className="font-bold text-xl sm:hidden">BBB</span>
          </Link>

          <div className="hidden md:flex ml-6">
            {!isAdminPage ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        )}
                      >
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/inventory" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        )}
                      >
                        Inventory
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        )}
                      >
                        About Us
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/contact" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        )}
                      >
                        Contact
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <div className="flex items-center space-x-2">
                {adminNavItems.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAdminPage && (
            <>
              <Link href="/admin" className="hidden md:block">
                <Button size="sm">Admin Login</Button>
              </Link>
            </>
          )}
          {isAdminPage && (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>User Menu</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="px-4 pt-4 pb-2 text-left border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4 px-4">
                {isAdminPage ? (
                  <>
                    {adminNavItems.map((item) => (
                      <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Button>
                      </Link>
                    ))}
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-red-500">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Home
                      </Button>
                    </Link>
                    <Link href="/inventory" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Inventory
                      </Button>
                    </Link>
                    <Link href="/about" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        About Us
                      </Button>
                    </Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button className="w-full mt-4">Admin Login</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
