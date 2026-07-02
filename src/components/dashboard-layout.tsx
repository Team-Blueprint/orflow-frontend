import { useState, type ReactNode } from "react"
import { Link, useRouter } from "@tanstack/react-router"
import { Widget3, Refresh, Bill, UsersGroupRounded, Settings } from "@/lib/icons"
import { WebhookIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type Project = { id: string; name: string; environment: "sandbox" | "live" }

const projects: Project[] = [
  { id: "proj_1", name: "My SaaS App", environment: "sandbox" },
  { id: "proj_2", name: "Production App", environment: "live" },
]

interface NavItem {
  label: string
  to: string
  icon: typeof Widget3
}

const mainNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Widget3 },
  { label: "Subscriptions", to: "#", icon: Refresh },
  { label: "Plans", to: "#", icon: Bill },
  { label: "Customers", to: "#", icon: UsersGroupRounded },
  { label: "Webhooks", to: "#", icon: WebhookIcon },
]

const bottomNav: NavItem[] = [
  { label: "Settings", to: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(projects[0])
  const router = useRouter()

  function closeSidebar() {
    setSidebarOpen(false)
  }

  function selectProject(p: Project) {
    setCurrentProject(p)
    setProjectOpen(false)
  }

  const currentPath = router.state.location.pathname

  const navLinkClass = (to: string) =>
    currentPath === to
      ? "mx-3 px-3 py-2 bg-primary text-white font-sans text-sm font-semibold flex items-center gap-3 cursor-pointer border border-orange-600"
      : "mx-3 px-3 py-2 text-ink-soft hover:text-ink hover:bg-paper/40 font-sans text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer"

  const disabledClass =
    "mx-3 px-3 py-2 text-ink-soft/40 font-sans text-sm font-medium flex items-center gap-3 cursor-not-allowed"

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-hairline bg-paper px-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="cursor-pointer text-ink hover:text-primary transition-colors"
          style={{ minHeight: 44, minWidth: 44 }}
          aria-label="Open sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-bold tracking-tight text-white">Orflow</span>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 h-screen bg-canvas border-r border-hairline flex flex-col justify-between select-none transition-transform duration-200",
          "md:translate-x-0 md:static md:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          onClick={closeSidebar}
          className="h-14 flex items-center px-6 border-b border-hairline font-sans font-bold text-sm tracking-tight text-white cursor-pointer"
        >
          Orflow
        </Link>

        {/* Project selector */}
        <div className="relative mx-4 my-4">
          <button
            type="button"
            onClick={() => setProjectOpen((o) => !o)}
            className="w-full bg-paper/60 border border-hairline px-3 py-2 text-xs font-mono text-ink flex items-center justify-between hover:border-hairline-strong transition-colors cursor-pointer"
          >
            <span className="truncate">{currentProject.name}</span>
            <span className="text-zinc-600 font-mono text-[10px]">::</span>
          </button>

          {projectOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-hairline bg-paper">
              <div className="py-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProject(p)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-xs font-mono transition-colors duration-150 cursor-pointer",
                      p.id === currentProject.id
                        ? "text-primary"
                        : "text-ink-soft hover:text-ink hover:bg-paper/40",
                    )}
                  >
                    <span>{p.name}</span>
                    {p.id === currentProject.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-hairline">
                <Link
                  to="/new"
                  onClick={() => { setProjectOpen(false); closeSidebar() }}
                  className="flex items-center px-3 py-2 text-xs font-mono text-ink-soft hover:text-ink hover:bg-paper/40 transition-colors cursor-pointer"
                >
                  + New project
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Nav heading */}
        <p className="px-6 text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
          Pages
        </p>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto">
          {mainNav.map((item) =>
            item.to === "#" ? (
              <div key={item.label} className={disabledClass}>
                <item.icon size={16} />
                {item.label}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to as any}
                onClick={closeSidebar}
                className={navLinkClass(item.to)}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Bottom footer */}
        <div className="pt-4 border-t border-hairline mb-4">
          {bottomNav.map((item) => (
            <Link
              key={item.label}
              to={item.to as any}
              onClick={closeSidebar}
              className={navLinkClass(item.to)}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline flex items-center justify-between px-8 z-30 hidden md:flex">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-ink-soft">
            Workspace
            <span className="text-zinc-700">/</span>
            <span className="text-ink font-semibold">{currentProject.name}</span>
          </div>

          {/* System actions */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              API: OPERATIONAL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 text-zinc-400 border border-hairline">
              {currentProject.environment === "live" ? "LIVE" : "SANDBOX"}
            </span>
            <div className="w-7 h-7 bg-paper border border-hairline text-ink font-mono text-[10px] flex items-center justify-center cursor-pointer hover:border-hairline-strong">
              OR
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 pt-14 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
