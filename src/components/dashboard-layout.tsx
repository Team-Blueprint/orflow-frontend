import { useState, useRef, useEffect, useMemo, type ReactNode, type ElementType } from "react";
import { Link, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { HomeAngle } from "@solar-icons/react";
import {
  ChartSquare,
  Refresh,
  Bill,
  UsersGroupRounded,
  Settings,
} from "@/lib/icons";
import { WebhookIcon, LogoIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { setActiveProjectId } from "@/api/apiClient";
import { useProjects } from "@/api/hooks/useProjects";

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

const mainNav: NavItem[] = [
  { label: "Overview", to: "/dashboard/$projectId", icon: ChartSquare },
  { label: "Plans", to: "/dashboard/$projectId/plans", icon: Bill },
  { label: "Subscriptions", to: "/dashboard/$projectId/subscriptions", icon: Refresh },
  { label: "Customers", to: "/dashboard/$projectId/customers", icon: UsersGroupRounded },
  { label: "Webhooks", to: "/dashboard/$projectId/webhooks", icon: WebhookIcon },
];

const bottomNav: NavItem[] = [
  { label: "Settings", to: "/dashboard/$projectId/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const projectSelectorRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { projectId } = useParams({ strict: false });

  const { data: projects, isLoading: isProjectsLoading, error: projectsError } = useProjects();

  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const currentProject = useMemo<Project | null>(() => {
    if (!projects?.length || !projectId) return null;
    return projects.find(p => p.id === projectId) ?? null;
  }, [projectId, projects]);

  useEffect(() => {
    if (projectId) {
      setActiveProjectId(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (projects?.length && projectId && !projects.find(p => p.id === projectId)) {
      navigateRef.current({ to: `/dashboard/${projects[0].id}` as any });
    }
  }, [projectId, projects]);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function selectProject(p: Project) {
    setActiveProjectId(p.id);
    setProjectOpen(false);
    navigate({ to: `/dashboard/${p.id}` as any });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectSelectorRef.current && !projectSelectorRef.current.contains(event.target as Node)) {
        setProjectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveRoute = (path: string) => {
    if (path === "#") return false;
    const resolvedPath = path.replace("$projectId", currentProject?.id ?? "");
    const baseProjectPath = `/dashboard/${currentProject?.id}`;
    if (resolvedPath === baseProjectPath) {
      return location.pathname === baseProjectPath || location.pathname === baseProjectPath + "/";
    }
    return location.pathname === resolvedPath || location.pathname.startsWith(resolvedPath + "/");
  };

  if (isProjectsLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas text-ink">Loading projects...</div>;
  }

  if (projectsError) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas text-ink">Error loading projects</div>;
  }

  if (!projects?.length) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas text-ink">No projects found</div>;
  }

  if (!currentProject) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas text-ink">Loading project...</div>;
  }

  const dynamicMainNav = mainNav.map(item => ({
    ...item,
    to: item.to.replace("$projectId", currentProject.id),
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="fixed inset-x-0 top-0 z-[60] flex h-16 items-center justify-between border-b border-zinc-800 bg-canvas/80 backdrop-blur-md px-4 md:hidden">
        <div className="flex items-center gap-3">
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
          <a href="/" className="flex items-center gap-2 text-sm font-mono font-bold tracking-tight text-ink cursor-pointer">
            <LogoIcon size={18} variant="orange" />
            Orflow
          </a>
        </div>

        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="w-8 h-8 bg-paper border border-hairline text-ink font-mono text-[11px] flex items-center justify-center cursor-pointer hover:border-hairline-strong transition-colors"
            style={{ minHeight: 32, minWidth: 32 }}
          >
            {user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "OR"}
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[65] bg-black/60 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-hairline bg-canvas transition-transform duration-200",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <a
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-2 cursor-pointer"
          >
            <LogoIcon size={20} variant="orange" />
            <span className="text-base font-semibold tracking-tight text-ink">Orflow</span>
          </a>
          <button
            type="button"
            onClick={closeSidebar}
            className="md:hidden text-ink-soft hover:text-ink transition-colors cursor-pointer"
            style={{ minHeight: 44, minWidth: 44 }}
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative px-3 pb-4" ref={projectSelectorRef}>
          <button
            type="button"
            onClick={() => setProjectOpen((o) => !o)}
            className="flex w-full items-center justify-between border border-hairline bg-canvas px-3 py-2 text-sm text-ink transition-colors duration-150 hover:bg-midnight-soft cursor-pointer"
          >
            <span className="truncate">{currentProject.name}</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={cn("shrink-0 text-ink-soft transition-transform duration-150", projectOpen && "rotate-180")}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {projectOpen && (
            <div className="absolute left-3 right-3 top-full z-50 mt-0 border border-hairline bg-paper shadow-soft-lift">
              <div className="py-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProject(p)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors duration-150 cursor-pointer",
                      p.id === currentProject.id
                        ? "text-primary"
                        : "text-ink-soft hover:text-ink hover:bg-midnight-soft",
                    )}
                  >
                    <span>{p.name}</span>
                    {p.id === currentProject.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                  className="flex items-center px-3 py-2 text-sm text-ink-soft hover:text-ink hover:bg-midnight-soft transition-colors duration-150 cursor-pointer"
                >
                  + New project
                </Link>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          {/* Dashboard — standalone */}
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
              location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                ? "bg-primary/60 text-white"
                : "text-ink-soft hover:text-ink hover:bg-primary/5",
            )}
          >
            <HomeAngle size={18} />
            Dashboard
          </Link>

          <div className="my-3 border-t border-hairline" />

          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-soft/60 select-none">
            {currentProject.name}
          </p>

          {dynamicMainNav.map((item) =>
            item.to.startsWith("#") ? (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-ink-soft cursor-not-allowed opacity-50"
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.to as any}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
                  isActiveRoute(item.to)
                    ? "bg-primary/60 text-white"
                    : "text-ink-soft hover:text-ink hover:bg-primary/5",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="border-t border-hairline px-3 py-3">
          {bottomNav.map((item) => (
            <Link
              key={item.label}
              to={item.to as any}
              onClick={closeSidebar}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
                  isActiveRoute(item.to)
                    ? "bg-primary/60 text-white"
                    : "text-ink-soft hover:text-ink hover:bg-primary/5",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 pt-14 md:pt-0">
        <header className="h-14 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline hidden md:flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-soft">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-ink transition-colors cursor-pointer">
              <LogoIcon size={16} variant="orange" />
              <span>Dashboard</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <Link to={`/dashboard/${currentProject.id}` as any} className="text-ink font-semibold hover:text-primary transition-colors cursor-pointer">
              {currentProject.name}
            </Link>
          </div>

          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="w-7 h-7 bg-paper border border-hairline text-ink font-mono text-[10px] flex items-center justify-center cursor-pointer hover:border-hairline-strong transition-colors"
              style={{ minHeight: 28, minWidth: 28 }}
            >
              {user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "OR"}
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
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
