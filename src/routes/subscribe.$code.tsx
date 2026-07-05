import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSubscriptionPage, useCreatePortalSubscription } from "@/lib/portal-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmount } from "@/lib/portal-data";
import { CloseCircle, Lock } from "@solar-icons/react";

export const Route = createFileRoute("/subscribe/$code")({
  component: SubscribePage,
});

const intervalLabel: Record<string, string> = {
  daily: "Daily", weekly: "Weekly", monthly: "Monthly",
  quarterly: "Quarterly", yearly: "Yearly",
};

function SubscribePage() {
  const { code } = Route.useParams();
  const { data: plan, isLoading, error } = useSubscriptionPage(code);
  const createSub = useCreatePortalSubscription();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!plan || error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center max-w-lg mx-auto">
        <CloseCircle weight="BoldDuotone" className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This subscription page doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <Lock weight="BoldDuotone" className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Nomba Checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Secure payment page
            </p>
          </div>
          <div className="w-full rounded-lg bg-muted p-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium text-foreground">{plan.plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-foreground">NGN {formatAmount(plan.plan.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing</span>
              <span className="font-medium text-foreground">{intervalLabel[plan.plan.interval]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium text-foreground">{name}</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground w-full">
            <p className="font-medium text-foreground mb-1">Secure Checkout</p>
            <p>You will be redirected to a secure payment page to complete your subscription.</p>
          </div>
          <Button
            size="lg"
            className="w-full min-h-[44px]"
            onClick={async () => {
              try {
                const result = await createSub.mutateAsync({
                  planId: plan.plan.id,
                  name,
                  email,
                });
                if (result.checkoutLink) {
                  window.location.href = result.checkoutLink;
                }
              } catch {
                setErrorMsg("Something went wrong. Please try again.");
              }
            }}
            disabled={createSub.isPending}
          >
            {createSub.isPending ? "Redirecting to secure payment…" : `Pay NGN ${formatAmount(plan.plan.amount)}`}
          </Button>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) { setErrorMsg("Name is required"); return; }
    if (!email.trim()) { setErrorMsg("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg("Enter a valid email address"); return; }
    setRedirecting(true);
    setTimeout(() => {
      setRedirecting(false);
      setShowCheckout(true);
    }, 1500);
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
      {/* Left: merchant context + plan summary */}
      <div className="flex flex-col gap-6 mb-8 lg:mb-0 lg:sticky lg:top-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{plan.merchant.name}</p>
          <p className="text-xs text-muted-foreground">via Orflow</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-3">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              NGN {formatAmount(plan.plan.amount)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">
              /{intervalLabel[plan.plan.interval].toLowerCase()}
            </span>
          </div>
          <p className="text-base font-semibold tracking-tight text-foreground">{plan.plan.name}</p>
          {plan.plan.description && (
            <p className="mt-1 text-sm text-muted-foreground">{plan.plan.description}</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground italic leading-relaxed">
          We&apos;ll email you a confirmation before each payment, so you can cancel anytime.
        </p>
      </div>

      {/* Right: form */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-name">Full name</Label>
            <Input
              id="sub-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="min-h-[44px]"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-email">Email address</Label>
            <Input
              id="sub-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-[44px]"
            />
          </div>
          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
          <Button
            type="submit"
            size="lg"
            disabled={redirecting}
            className="w-full min-h-[44px]"
          >
            {redirecting
              ? "Redirecting to secure payment…"
              : `Subscribe — NGN ${formatAmount(plan.plan.amount)}/${intervalLabel[plan.plan.interval].toLowerCase()}`
            }
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock weight="Linear" size={12} />
            <span>Payments secured by Nomba</span>
          </div>
        </form>
      </div>
    </div>
  );
}
