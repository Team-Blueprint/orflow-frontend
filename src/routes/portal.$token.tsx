import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  usePortalSubscription,
  useUpdatePortalCard,
  useCancelPortalSubscription,
  usePausePortalSubscription,
} from "@/lib/portal-queries";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/portal-data";
import type { BillingRecord } from "@/lib/portal-data";
import { Card, DangerTriangle, CheckCircle } from "@solar-icons/react";

export const Route = createFileRoute("/portal/$token")({
  component: PortalSubscriptionPage,
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function intervalLabel(interval: string): string {
  switch (interval) {
    case "daily": return "/day";
    case "weekly": return "/week";
    case "monthly": return "/month";
    case "quarterly": return "/3 months";
    case "yearly": return "/year";
    default: return ` /${interval}`;
  }
}

function PortalSubscriptionPage() {
  const { token } = Route.useParams();
  const { data, isLoading } = usePortalSubscription(token);
  useDocumentTitle(data ? `${data.plan?.name ?? ""} Billing Portal` : "Billing Portal");
  const updateCard = useUpdatePortalCard(token);
  const cancelSub = useCancelPortalSubscription(token);
  const pauseSub = usePausePortalSubscription(token);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [cardUpdated, setCardUpdated] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [showPause, setShowPause] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6">
        <DangerTriangle weight="BoldDuotone" className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            We couldn&apos;t find this subscription
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the link and try again.
          </p>
        </div>
      </div>
    );
  }

  const { subscription, plan, subscriber, billing } = data;
  const needsBanner = ["past_due", "dunning", "suspended"].includes(subscription.status);
  const showActions = ["active", "trialing", "past_due", "dunning"].includes(subscription.status);

  function inferBrand(cardNum: string): string {
    if (!cardNum) return "Visa";
    const first = cardNum[0];
    if (first === "4") return "Visa";
    if (first === "5") return "Mastercard";
    if (first === "2") return "Mastercard";
    if (first === "3") return "Amex";
    if (first === "6") return "Discover";
    return "Visa";
  }

  function handleSaveCard() {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length < 4) return;
    const brand = inferBrand(cleaned);
    const last4 = cleaned.slice(-4);
    updateCard.mutate(
      { brand, last4 },
      {
        onSuccess: () => {
          setCardUpdated(true);
          setTimeout(() => {
            setShowUpdateCard(false);
            setCardUpdated(false);
            setCardNumber("");
            setCardExpiry("");
            setCardCvv("");
          }, 2000);
        },
      },
    );
  }

  function handleCancelConfirm() {
    cancelSub.mutate(undefined, {
      onSuccess: () => setShowCancel(false),
    });
  }

  function handlePauseConfirm() {
    pauseSub.mutate(undefined, {
      onSuccess: () => setShowPause(false),
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Hi {subscriber?.name ?? "there"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your {plan?.name ?? "subscription"} subscription
        </p>
      </div>

      {/* Status Banner */}
      {needsBanner && (
        <div className="mb-6 border border-destructive/30 bg-destructive/8 p-4">
          <div className="flex items-start gap-3">
            <Card weight="Bold" className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              {subscription.status === "suspended" ? (
                <>
                  <p className="text-sm font-medium text-foreground">Your subscription is suspended</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update your payment method to restore access immediately.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3 min-h-[44px]"
                    onClick={() => setShowUpdateCard(true)}
                  >
                    Reactivate subscription
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">Your last payment failed</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;ll retry soon. Update your card now to avoid losing access.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3 min-h-[44px]"
                    onClick={() => setShowUpdateCard(true)}
                  >
                    Update payment method
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plan Summary + Payment Method */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground mb-3">
            Plan
          </p>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-medium text-foreground">{plan?.name ?? "Unknown plan"}</p>
              <p className="mt-1 font-mono tabular-nums text-sm text-foreground">
                NGN {formatAmount(subscription.amount)}{plan ? intervalLabel(plan.interval) : ""}
              </p>
            </div>
            <StatusBadge status={subscription.status} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {subscription.status === "trialing" && `Trial ends: ${formatDate(subscription.nextPaymentDate)}`}
            {subscription.status === "cancelled" && `Access until: ${formatDate(subscription.nextPaymentDate)}`}
            {!["trialing", "cancelled"].includes(subscription.status) && `Next charge: ${formatDate(subscription.nextPaymentDate)}`}
          </p>
        </div>

        <div className="border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground mb-3">
            Payment method
          </p>
          <div className="flex items-center gap-3">
            <Card weight="Linear" className="h-5 w-5 text-muted-foreground shrink-0" />
            {subscriber?.cardBrand && subscriber.cardLast4 ? (
              <div>
                <p className="font-mono text-sm text-foreground">
                  •••• •••• •••• {subscriber.cardLast4}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscriber.cardBrand}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No card on file</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 min-h-[44px]"
            onClick={() => setShowUpdateCard(true)}
          >
            Update card
          </Button>
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-foreground mb-3">Recent payments</h2>
        <DataTable<BillingRecord>
          columns={[
            { key: "date", header: "Date", cell: (r) => <span className="text-sm text-foreground">{formatDate(r.date)}</span> },
            {
              key: "amount",
              header: "Amount",
              cell: (r) => (
                <span className="font-mono tabular-nums text-sm text-foreground">
                  NGN {formatAmount(r.amount)}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              cell: (r) => (
                <StatusBadge status={r.status === "paid" ? "active" : "past_due"} />
              ),
            },
            {
              key: "receipt",
              header: "Receipt",
              cell: () => <span className="text-sm text-muted-foreground">&mdash;</span>,
            },
          ]}
          data={billing}
          emptyMessage="No billing records yet."
          renderMobileCard={(r) => (
            <div className="flex items-center justify-between px-4 py-3 min-h-[44px]">
              <div>
                <p className="font-mono tabular-nums text-sm text-foreground">NGN {formatAmount(r.amount)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={r.status === "paid" ? "active" : "past_due"} />
                <span className="text-xs text-muted-foreground">&mdash;</span>
              </div>
            </div>
          )}
        />
      </div>

      {/* Pause + Cancel */}
      {showActions && (
        <div className="mt-8 border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              onClick={() => setShowPause(true)}
            >
              Pause subscription
            </Button>
            <Button
              variant="destructive"
              className="flex-1 min-h-[44px]"
              onClick={() => setShowCancel(true)}
            >
              Cancel subscription
            </Button>
          </div>
        </div>
      )}

      {/* Update Card Modal */}
      {showUpdateCard && !cardUpdated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Update payment method</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground" htmlFor="card-number">Card number</label>
                <input
                  id="card-number"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-foreground" htmlFor="card-expiry">Expiry</label>
                  <input
                    id="card-expiry"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-foreground" htmlFor="card-cvv">CVV</label>
                  <input
                    id="card-cvv"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => {
                  setShowUpdateCard(false);
                  setCardNumber("");
                  setCardExpiry("");
                  setCardCvv("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1 min-h-[44px]"
                onClick={handleSaveCard}
                disabled={cardNumber.replace(/\s/g, "").length < 4}
              >
                Save card
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card Updated Success */}
      {cardUpdated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-center shadow-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle weight="BoldDuotone" className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">Card updated</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payment method has been updated successfully.
            </p>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Cancel your subscription?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ll keep access until {formatDate(subscription.nextPaymentDate)}. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setShowCancel(false)}
              >
                Keep subscription
              </Button>
              <Button
                variant="destructive"
                className="flex-1 min-h-[44px]"
                onClick={handleCancelConfirm}
              >
                Cancel subscription
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Confirmation Modal */}
      {showPause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Pause your subscription?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your subscription will be paused. Billing will stop. You can resume anytime.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setShowPause(false)}
              >
                Go back
              </Button>
              <Button
                variant="default"
                className="flex-1 min-h-[44px]"
                onClick={handlePauseConfirm}
              >
                Pause subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
