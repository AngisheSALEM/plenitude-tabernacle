"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Video, 
  Headphones, 
  Megaphone, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Book,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"

const sidebarLinks = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/audio", label: "Audio", icon: Headphones },
  { href: "/admin/sermons", label: "Prédications", icon: Book },
  { href: "/admin/cantiques", label: "Cantiques", icon: Book },
  { href: "/admin/annonces", label: "Annonces", icon: Megaphone },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/parametres", label: "Parametres", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300 flex flex-col",
          // Desktop behavior
          collapsed ? "lg:w-16" : "lg:w-64",
          // Mobile behavior
          mobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {(!collapsed || mobileOpen) && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">P</span>
              </div>
              <span className="font-serif font-semibold text-foreground">Admin</span>
            </Link>
          )}

          <div className="flex items-center">
            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-muted-foreground hover:text-foreground"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/admin" && pathname.startsWith(link.href))
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {(!collapsed || mobileOpen) && <span className="text-sm font-medium">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-border space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            )}
          >
            <Home className="h-5 w-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span className="text-sm font-medium">Retour au site</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span className="text-sm font-medium">Deconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        collapsed ? "lg:ml-16" : "lg:ml-64",
        "ml-0" // Always 0 on mobile because sidebar is fixed/overlay
      )}>
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate max-w-[150px] sm:max-w-none">
              {sidebarLinks.find(l => l.href === pathname)?.label || "Administration"}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-sm font-semibold">
                    {session?.user?.firstName ? session.user.firstName[0] : (session?.user?.name ? session.user.name[0] : "A")}
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {session?.user?.firstName ? `${session.user.firstName} ${session.user.lastName || ""}` : (session?.user?.name || "Administrateur")}
                </p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
