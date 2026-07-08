import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useSubscriptionPage,
  useCreatePortalSubscription,
} from "@/lib/portal-queries";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmount } from "@/lib/portal-data";
import { LinkBroken, Lock, Copy } from "@solar-icons/react";
import { useToast } from "@/components/webhooks/utils/toast";

export const Route = createFileRoute("/subscribe/$code")({
  component: SubscribePage,
});

const intervalLabel: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const NOMBA_TEST_CARDS = [
  { cardNumber: "5434 6210 7425 2808", network: "Mastercard", outcome: "Approved" },
  { cardNumber: "4000 0000 0000 2503", network: "Visa", outcome: "3DS required" },
  { cardNumber: "5484 4972 1831 7651", network: "Mastercard", outcome: "Do not honor" },
];

function getCheckoutRedirectUrl(checkoutLink: string, orderReference?: string) {
  try {
    const checkoutUrl = new URL(checkoutLink);
    const isSandboxCheckout = checkoutUrl.hostname.toLowerCase().includes("sandbox");
    if (!isSandboxCheckout) return checkoutLink;

    const callbackUrl = new URL("/portal/callback", window.location.origin);
    if (orderReference) {
      callbackUrl.searchParams.set("orderReference", orderReference);
    }
    const callbackHref = callbackUrl.toString();

    const callbackParamNames = [
      "callbackUrl",
      "callback_url",
      "redirectUrl",
      "redirect_url",
      "returnUrl",
      "return_url",
    ];

    callbackParamNames.forEach((name) => {
      if (!checkoutUrl.searchParams.has(name)) {
        checkoutUrl.searchParams.set(name, callbackHref);
      }
    });

    return checkoutUrl.toString();
  } catch {
    return checkoutLink;
  }
}

function SubscribePage() {
  const { code } = Route.useParams();
  const { data: plan, isLoading, error } = useSubscriptionPage(code);
  useDocumentTitle(
    plan ? `${plan.plan.name} - ${plan.merchant.name}` : "Subscribe",
  );
  const createSub = useCreatePortalSubscription(code);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [redirecting] = useState(false);
  const toast = useToast();

  const copyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast.success("Card number copied");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!plan || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-6rem)] text-center">
        <div className="flex items-center justify-center size-14 rounded-full bg-red-50">
          <LinkBroken
            weight="BoldDuotone"
            className="size-7 text-destructive"
          />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-ink tracking-tight">
          Link not found
        </h1>
        <p className="mt-2 text-sm text-ink-soft text-center max-w-sm leading-relaxed">
          This subscription page doesn&apos;t exist or has been removed.
        </p>
        <Button
          asChild
          variant="default"
          size="lg"
          className="mt-8 rounded-none min-h-[44px]"
        >
          <a href="/">Back to Home</a>
        </Button>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="border border-border bg-card max-lg:border-0 max-lg:bg-transparent max-lg:p-0 p-8 max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-4 max-lg:px-4 max-lg:pt-4 pb-4 text-center">
          <Lock weight="BoldDuotone" className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Nomba Checkout
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Secure payment page
            </p>
          </div>
          <div className="w-full bg-muted max-lg:p-3 p-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium text-foreground">
                {plan.plan.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-foreground">
                NGN {formatAmount(plan.plan.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing</span>
              <span className="font-medium text-foreground">
                {intervalLabel[plan.plan.interval]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium text-foreground">{name}</span>
        </div>
      </div>
          <div className="border border-border bg-muted/50 max-lg:border-0 max-lg:p-3 p-4 text-sm text-muted-foreground w-full">
            <p className="font-medium text-foreground mb-1">Secure Checkout</p>
            <p>
              You will be redirected to a secure payment page to complete your
              subscription.
            </p>
          </div>
          
          {plan.is_test && (
            <div className="border border-border bg-card max-lg:border-0 max-lg:bg-muted/30 max-lg:p-3 p-4 w-full">
              <h3 className="text-sm font-medium text-foreground mb-3">Test Card Reference</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Card Number</span>
                  <span>Network</span>
                  <span>Outcome</span>
                </div>
                {NOMBA_TEST_CARDS.map((card) => (
                  <div key={card.cardNumber} className="flex justify-between text-foreground items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{card.cardNumber.slice(-4)} ••••</span>
                      <button
                        type="button"
                        onClick={() => copyCardNumber(card.cardNumber)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        aria-label="Copy full card number"
                      >
                        <Copy weight="Linear" className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <span className="text-xs">{card.network}</span>
                    <span className="text-xs text-gray-600">{card.outcome}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  Use any 3-digit CVV and future expiry date. Enter card number to test different outcomes.
                </p>
              </div>
            </div>
          )}

          <div className="border border-border bg-primary/5 max-lg:border-0 max-lg:p-3 p-4 w-full text-left">
            <p className="text-xs font-medium text-foreground">After payment — portal access</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Check your email for a 6-digit PIN to access your self-service portal where you can manage your subscription, view payment history, and update your card.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full min-h-[44px]"
            onClick={async () => {
              try {
                const result = await createSub.mutateAsync({ name, email });
                if (result.checkoutLink) {
                  window.location.href = getCheckoutRedirectUrl(
                    result.checkoutLink,
                    result.orderReference,
                  );
                }
              } catch {
                setErrorMsg("Something went wrong. Please try again.");
              }
            }}
            disabled={createSub.isPending}
          >
            {createSub.isPending
              ? "Redirecting to secure payment…"
              : `Pay NGN ${formatAmount(plan.plan.amount)}`}
          </Button>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("Name is required");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Enter a valid email address");
      return;
    }
    setShowCheckout(true);
  }

  return (
    <>
      {plan.is_test && (
        <div className="mb-6 border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">Test Mode</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Test Mode: This is a test payment page. No real charges will be made. Do not share or send this URL to live customers.
          </p>
        </div>
      )}
      <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
      {/* Left: merchant context + plan summary */}
      <div className="flex flex-col gap-6 mb-8 lg:mb-0 lg:sticky lg:top-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {plan.merchant.name}
          </p>
          <p className="text-xs text-muted-foreground">via Orflow</p>
        </div>

        <div className="border border-border bg-card max-lg:border-0 max-lg:bg-transparent max-lg:p-0 p-6">
          <div className="mb-3">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              NGN {formatAmount(plan.plan.amount)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">
              /{intervalLabel[plan.plan.interval].toLowerCase()}
            </span>
          </div>
          <p className="text-base font-semibold tracking-tight text-foreground">
            {plan.plan.name}
          </p>
          {plan.plan.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.plan.description}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground italic leading-relaxed">
          We&apos;ll email you a confirmation before each payment, so you can
          cancel anytime.
        </p>
      </div>

      {/* Right: form */}
      <div className="border border-border bg-card max-lg:border-0 max-lg:bg-transparent max-lg:p-0 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sub-name">Full name</Label>
            <Input
              id="sub-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="min-h-[44px] rounded-none"
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
              className="min-h-[44px] rounded-none"
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
              : `Subscribe — NGN ${formatAmount(plan.plan.amount)}/${intervalLabel[plan.plan.interval].toLowerCase()}`}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock weight="Linear" size={12} />
            <span>Payments secured by Nomba</span>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
