import { useEffect } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

function PortalLayout() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark");
    html.classList.add("light");
    return () => {
      html.classList.remove("light");
      html.classList.add("dark");
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Orflow
        </span>
        <a
          href="mailto:hi@orflow.io"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Need help?
        </a>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">Powered by Orflow</p>
      </footer>
    </div>
  );
}
