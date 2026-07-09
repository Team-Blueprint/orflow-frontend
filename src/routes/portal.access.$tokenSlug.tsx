import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { usePortalAccessInfo, usePortalVerifyAccess } from "@/lib/portal-queries";
import { setPortalToken, setPortalSlug, setPortalCustomerName } from "@/lib/portal-auth";
import { Button } from "@/components/ui/button";
import { Lock, DangerTriangle } from "@solar-icons/react";

export const Route = createFileRoute("/portal/access/$tokenSlug")({
  component: PortalAccessPage,
});

const MASK_DELAY = 400;

function PortalAccessPage() {
  const { tokenSlug } = Route.useParams();
  const { pin: queryPin, customer_name: searchName } = Route.useSearch() as { pin?: string; customer_name?: string };
  const navigate = useNavigate();
  const verify = usePortalVerifyAccess();
  const { data: accessInfo, isError: accessError } = usePortalAccessInfo(tokenSlug);

  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const submittedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const customerName = accessInfo?.name ?? searchName ?? null;

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const pin = pinDigits.join("");
    if (pin.length < 6) {
      setError("PIN must be 6 digits");
      return;
    }

    try {
      const token = await verify.mutateAsync({ token_slug: tokenSlug, pin });
      setPortalToken(token);
      setPortalSlug(tokenSlug);
      if (customerName) setPortalCustomerName(customerName);
      navigate({ to: "/portal/dashboard", replace: true });
    } catch {
      setError("Invalid PIN. Check your email for the correct PIN.");
    }
  }, [pinDigits, verify, tokenSlug, navigate, customerName]);

  function handleInputChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 6).split("");
    const prevLen = pinDigits.length;
    setPinDigits(digits);

    for (let i = prevLen; i < digits.length; i++) {
      const idx = i;
      setVisible(prev => new Set(prev).add(idx));
      const existing = timersRef.current.get(idx);
      if (existing) clearTimeout(existing);
      timersRef.current.set(
        idx,
        setTimeout(() => {
          setVisible(prev => {
            const next = new Set(prev);
            next.delete(idx);
            return next;
          });
        }, MASK_DELAY),
      );
    }
  }

  useEffect(() => {
    const pin = pinDigits.join("");
    if (queryPin && queryPin.length === 6 && !submittedRef.current && pin.length === 0) {
      submittedRef.current = true;
      handleInputChange(queryPin);
      const timer = setTimeout(() => {
        handleSubmit();
      }, MASK_DELAY + 200);
      return () => clearTimeout(timer);
    }
  }, [queryPin]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!accessError) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [accessError]);

  if (accessError && !accessInfo) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-red-500/10">
            <DangerTriangle weight="BoldDuotone" className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Portal access not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This link is invalid or expired. Check your email for the correct link or contact support.
          </p>
          <Link to="/" className="mt-6 inline-block text-sm text-foreground underline underline-offset-2">
            Go to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="border border-border bg-card p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center bg-primary/10 mb-4">
              <Lock weight="BoldDuotone" className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {customerName ? `Welcome, ${customerName}` : "Enter your access PIN"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {customerName ? `${customerName}, enter the 6-digit PIN sent to your email` : "We sent a 6-digit PIN to your email"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <div className="flex justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 w-10 items-center justify-center border border-border bg-muted/50 font-mono text-xl tracking-wider text-foreground"
                  >
                    {pinDigits[i] ? (visible.has(i) ? pinDigits[i] : "•") : ""}
                  </div>
                ))}
              </div>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pinDigits.join("")}
                onChange={e => handleInputChange(e.target.value)}
                className="absolute inset-0 w-full cursor-default opacity-0"
                autoFocus
                autoComplete="one-time-code"
                aria-label="Enter 6-digit PIN"
              />
            </div>

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
              disabled={pinDigits.join("").length < 6 || verify.isPending}
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
