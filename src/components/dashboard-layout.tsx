import { useState, useRef, useEffect, type ReactNode, type ElementType } from "react";
import { Link, useRouter, useNavigate, useParams } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  ChartSquare,
  Refresh,
  Bill,
  UsersGroupRounded,
  Settings,
} from "@/lib/icons";
import { WebhookIcon, LogoIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { apiClient, setActiveProjectId } from "@/api/apiClient";

interface NavItem {
  label: string;
  to: string;
  icon: ElementType;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const router = useRouter();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projectId } = useParams({ from: "/dashboard/$projectId" });

  const currentPath = router.state.location.pathname;
  const currentProjectId = projectId;
  const subView = currentPath.split("/").filter(Boolean).slice(2).join("/");

  const projectBase = `/dashboard/${currentProjectId}`;

  useEffect(() => {
    apiClient.get<Project[]>("/v1/projects/list").then((res) => {
      setProjects(res.data);
      const found = res.data.find((p) => p.id === currentProjectId);
      if (found) setProjectName(found.name);
    }).catch(() => {});
  }, [currentProjectId]);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function selectProject(p: Project) {
    setProjectOpen(false);
    setActiveProjectId(p.id);
    const target = subView ? `/dashboard/${p.id}/${subView}` : `/dashboard/${p.id}`;
    navigate({ to: target });
  }

  const projectRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) {
        setProjectOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(e.target as Node)) {
        setMobileUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainNav: NavItem[] = [
    { label: "Overview", to: projectBase, icon: ChartSquare },
    { label: "Plans", to: `${projectBase}/plans`, icon: Bill },
    { label: "Subscriptions", to: "#", icon: Refresh },
    { label: "Customers", to: "#", icon: UsersGroupRounded },
    { label: "Webhooks", to: "#", icon: WebhookIcon },
  ];

  const bottomNav: NavItem[] = [
    { label: "Settings", to: `${projectBase}/settings`, icon: Settings },
  ];

  const navLinkClass = (to: string) =>
    currentPath === to
      ? "mx-3 px-3 py-2 bg-primary text-white font-sans text-sm font-semibold flex items-center gap-3 cursor-pointer border border-orange-600"
      : "mx-3 px-3 py-2 text-ink-soft hover:text-ink hover:bg-paper/40 font-sans text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer";

  const disabledClass =
    "mx-3 px-3 py-2 text-ink-soft/40 font-sans text-sm font-medium flex items-center gap-3 cursor-not-allowed";

  function handleExitToAccount() {
    setActiveProjectId(null);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-2 border-b border-hairline bg-paper px-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="cursor-pointer text-ink hover:text-primary transition-colors shrink-0"
          style={{ minHeight: 44, minWidth: 44 }}
          aria-label="Open sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 text-xs font-mono text-ink-soft truncate min-w-0">
          <button
            type="button"
            onClick={handleExitToAccount}
            className="text-zinc-500 hover:text-ink transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <span className="text-zinc-700 shrink-0">/</span>
          <Link to="/dashboard" className="hover:text-ink transition-colors shrink-0">Dashboard</Link>
          <span className="text-zinc-700 shrink-0">/</span>
          <span className="text-ink font-semibold truncate min-w-0">{projectName || currentProjectId}</span>
        </div>
        <div className="flex-1 min-w-0" />
        <div ref={mobileUserMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMobileUserMenuOpen((o) => !o)}
            className="w-7 h-7 bg-paper border border-hairline text-ink font-mono text-[10px] flex items-center justify-center cursor-pointer hover:border-hairline-strong transition-colors"
          >
            {user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "OR"}
          </button>
          {mobileUserMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 border border-hairline bg-paper z-50">
              <div className="p-3 border-b border-hairline">
                <p className="text-xs font-semibold text-ink">{user?.name || "Orflow User"}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">{user?.email || "user@orflow.io"}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setMobileUserMenuOpen(false);
                  await logout();
                  navigate({ to: "/sign-in" });
                }}
                className="flex w-full items-center px-3 py-2 text-xs text-ink-soft hover:text-ink hover:bg-zinc-900/40 transition-colors cursor-pointer bg-transparent border-none text-left"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={closeSidebar} />
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
          to={projectBase}
          onClick={closeSidebar}
          className="h-14 flex items-center gap-2 px-6 border-b border-hairline font-sans font-bold text-sm tracking-tight text-white cursor-pointer"
        >
          <LogoIcon size={18} variant="orange" />
          Orflow
        </Link>

        {/* Project selector */}
        <div ref={projectRef} className="relative mx-4 my-4">
          <button
            type="button"
            onClick={() => setProjectOpen((o) => !o)}
            className="w-full bg-paper/60 border border-hairline px-3 py-2 text-xs font-mono text-ink flex items-center justify-between hover:border-hairline-strong transition-colors cursor-pointer"
          >
            <span className="truncate">{projectName || currentProjectId}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 shrink-0">
              {projectOpen ? (
                <path d="M18 15l-6-6-6 6" />
              ) : (
                <path d="M6 9l6 6 6-6" />
              )}
            </svg>
          </button>

          {projectOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-hairline bg-paper">
              <div className="py-1 max-h-48 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProject(p)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-xs font-mono transition-colors duration-150 cursor-pointer",
                      p.id === currentProjectId
                        ? "text-primary"
                        : "text-ink-soft hover:text-ink hover:bg-paper/40",
                    )}
                  >
                    <span>{p.name}</span>
                    {p.id === currentProjectId && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-hairline">
                <Link
                  to="/dashboard/new"
                  onClick={() => { setProjectOpen(false); closeSidebar(); }}
                  className="flex items-center px-3 py-2 text-xs font-mono text-ink-soft hover:text-ink hover:bg-paper/40 transition-colors cursor-pointer"
                >
                  + New project
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Nav heading */}
        <p className="px-6 text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Pages</p>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto">
          {mainNav.map((item) =>
            item.to === "#" ? (
              <div key={item.label} className={disabledClass}>
                <item.icon size={16} />
                {item.label}
              </div>
            ) : (
              <Link key={item.label} to={item.to as any} onClick={closeSidebar} className={navLinkClass(item.to)}>
                <item.icon size={16} />
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Bottom footer */}
        <div className="pt-4 border-t border-hairline mb-4">
          {bottomNav.map((item) => (
            <Link key={item.label} to={item.to as any} onClick={closeSidebar} className={navLinkClass(item.to)}>
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
            <button
              type="button"
              onClick={handleExitToAccount}
              className="text-zinc-500 hover:text-ink transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <span className="text-zinc-700">/</span>
            <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-ink font-semibold">{projectName || currentProjectId}</span>
          </div>

          {/* System actions */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              API: OPERATIONAL
            </span>
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="w-7 h-7 bg-paper border border-hairline text-ink font-mono text-[10px] flex items-center justify-center cursor-pointer hover:border-hairline-strong transition-colors"
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
                      setUserMenuOpen(false);
                      await logout();
                      navigate({ to: "/sign-in" });
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

        {/* Page content */}
        <div className="flex-1 pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
