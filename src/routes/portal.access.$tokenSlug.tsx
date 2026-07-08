import { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { usePortalVerifyAccess } from "@/lib/portal-queries";
import { setPortalToken, setPortalSlug } from "@/lib/portal-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, DangerTriangle } from "@solar-icons/react";

export const Route = createFileRoute("/portal/access/$tokenSlug")({
  component: PortalAccessPage,
});

function PortalAccessPage() {
  const { tokenSlug } = Route.useParams();
  const { pin: queryPin } = Route.useSearch() as { pin?: string };
  const navigate = useNavigate();
  const verify = usePortalVerifyAccess();
  const [pin, setPin] = useState(queryPin ?? "");
  const [error, setError] = useState("");
  const submittedRef = useRef(false);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");

    if (pin.length < 6) {
      setError("PIN must be 6 digits");
      return;
    }

    try {
      const token = await verify.mutateAsync({ token_slug: tokenSlug, pin });
      setPortalToken(token);
      setPortalSlug(tokenSlug);
      navigate({ to: "/portal/dashboard", replace: true });
    } catch {
      setError("Invalid PIN. Check your email for the correct PIN.");
    }
  }

  useEffect(() => {
    if (queryPin && queryPin.length === 6 && !submittedRef.current) {
      submittedRef.current = true;
      const timer = setTimeout(() => {
        handleSubmit();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [queryPin]);

  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="border border-border bg-card p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center bg-primary/10 mb-4">
              <Lock weight="BoldDuotone" className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Enter your access PIN
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a 6-digit PIN to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={pin}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPin(digits);
              }}
              className="text-center font-mono text-2xl tracking-[0.5em] min-h-[52px]"
              autoFocus
              autoComplete="one-time-code"
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <DangerTriangle weight="Bold" className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[44px]"
              disabled={pin.length < 6 || verify.isPending}
            >
              {verify.isPending ? "Verifying…" : "Access portal"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Didn&apos;t receive a PIN?{" "}
          <Link to="/" className="text-foreground underline underline-offset-2">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
