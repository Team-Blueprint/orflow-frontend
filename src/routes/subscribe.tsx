import { useEffect } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/subscribe")({
  component: SubscribeLayout,
});

function SubscribeLayout() {
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
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Outlet />
      </div>
    </div>
  );
}
