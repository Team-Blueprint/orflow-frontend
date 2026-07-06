import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const Route = createFileRoute("/auth/google/callback")({
  component: GoogleCallback,
});

function GoogleCallback() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Signing you in… | Orflow");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" />
        <p className="text-sm text-ink-soft">Signing you in…</p>
      </div>
    </div>
  );
}
