import { useState, useRef, useEffect, type ReactNode } from "react"
import { useAuth } from "@/lib/auth"
import { useNavigate, Link } from "@tanstack/react-router"

interface AccountLayoutProps {
  children: ReactNode
  breadcrumb?: string
}

export function AccountLayout({ children, breadcrumb }: AccountLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="h-14 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline flex items-center justify-between px-4 md:px-8 z-30">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-soft">
          {breadcrumb && breadcrumb !== "Dashboard" ? (
            <>
              <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
              <span className="text-zinc-700">/</span>
              <span className="text-ink font-semibold">{breadcrumb}</span>
            </>
          ) : (
            <span className="text-ink font-semibold">Dashboard</span>
          )}
        </div>

        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="w-7 h-7 bg-paper border border-hairline text-ink font-mono text-[10px] flex items-center justify-center cursor-pointer hover:border-hairline-strong transition-colors"
            style={{ minHeight: 28, minWidth: 28 }}
          >
            {user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "OR"}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 border border-hairline bg-paper z-50">
              <div className="p-3 border-b border-hairline">
                <p className="text-xs font-semibold text-ink">{user?.name || "Orflow User"}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">{user?.email || "user@orflow.io"}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setUserMenuOpen(false)
                  await logout()
                  navigate({ to: "/sign-in" })
                }}
                className="flex w-full items-center px-3 py-2 text-xs text-ink-soft hover:text-ink hover:bg-zinc-900/40 transition-colors cursor-pointer bg-transparent border-none text-left"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
