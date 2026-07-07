import { useState, useRef, useEffect, type ReactNode } from "react"
import { useAuth } from "@/lib/auth"
import { useNavigate } from "@tanstack/react-router"
import { LogoIcon } from "@/components/icons"
import { useEnv } from "@/lib/environment"

interface AccountLayoutProps {
  children: ReactNode
  breadcrumb?: string
}

export function AccountLayout({ children, breadcrumb }: AccountLayoutProps) {
  const { user, logout } = useAuth()
  const { isTest } = useEnv()
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
      <header className="h-16 w-full bg-canvas/80 backdrop-blur-md border-b border-zinc-800 z-50">
        <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            {breadcrumb && breadcrumb !== "Dashboard" ? (
              <>
                <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <LogoIcon size={22} variant="orange" />
                  <span className="text-sm font-mono font-bold text-ink tracking-tight">Orflow</span>
                </a>
                <span className="text-zinc-700 text-xs">/</span>
                <span className="text-xs font-mono text-ink font-semibold">{breadcrumb}</span>
              </>
            ) : (
              <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <LogoIcon size={24} variant="orange" />
                <span className="text-base font-mono font-bold text-ink tracking-tight">Orflow</span>
              </a>
            )}
          </div>

          <div ref={userMenuRef} className="relative flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border leading-none select-none ${isTest ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
              {isTest ? "TEST" : "LIVE"}
            </span>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="w-8 h-8 bg-paper border border-hairline text-ink font-mono text-[11px] flex items-center justify-center cursor-pointer hover:border-hairline-strong transition-colors"
              style={{ minHeight: 32, minWidth: 32 }}
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
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
