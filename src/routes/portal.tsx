import { useEffect } from "react";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { LogoIcon } from "@/components/icons/logo";
import { QuestionCircle } from "@solar-icons/react";

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
      <header className="flex h-20 items-center border-b border-border">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 md:px-6">
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <LogoIcon size={20} variant="orange" />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Orflow
            </span>
          </a>
          <a
            href="mailto:hi@orflow.io"
            className="flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Need help?
            <QuestionCircle weight="Linear" className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 text-center">
        <Link
          to="/"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Powered by Orflow
        </Link>
      </footer>
    </div>
  );
}
