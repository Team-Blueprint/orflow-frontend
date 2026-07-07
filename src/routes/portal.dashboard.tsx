import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useNombaCheckout,
  InitializeNombaCheckout,
} from "react-nomba-checkout-sdk";
import {
  usePortalSubscription,
  usePortalBillingHistory,
  useUpdatePortalCard,
  useCancelPortalSubscription,
  usePausePortalSubscription,
  useResumePortalSubscription,
  useUpdatePortalPin,
} from "@/lib/portal-queries";
import { getPortalToken, getPortalSlug, clearPortalSession } from "@/lib/portal-auth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { isTestMode } from "@/lib/environment";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/portal-data";
import type { PortalPaymentRead } from "@/lib/portal-data";
import { Card, DangerTriangle, CheckCircle, Eye } from "@solar-icons/react";

export const Route = createFileRoute("/portal/dashboard")({
  component: PortalDashboardPage,
});

const NOMBA_CLIENT_ID = import.meta.env.VITE_NOMBA_CLIENT_ID ?? "";
const NOMBA_ACCOUNT_ID = import.meta.env.VITE_NOMBA_ACCOUNT_ID ?? "";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PortalDashboardPage() {
  const navigate = useNavigate();
  const token = getPortalToken();
  const slug = getPortalSlug();

  useEffect(() => {
    InitializeNombaCheckout();
  }, []);

  useEffect(() => {
    if (!token) {
      if (slug) {
        navigate({ to: "/portal/access/$tokenSlug", params: { tokenSlug: slug }, replace: true });
      } else {
        navigate({ to: "/", replace: true });
      }
    }
  }, [token, slug, navigate]);

  const { data: subscription, isLoading, error } = usePortalSubscription();
  const { data: billing } = usePortalBillingHistory();
  const updateCard = useUpdatePortalCard();
  const cancelSub = useCancelPortalSubscription();
  const pauseSub = usePausePortalSubscription();
  const resumeSub = useResumePortalSubscription();
  const updatePin = useUpdatePortalPin();

  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [cardUpdating, setCardUpdating] = useState(false);
  const [cardUpdated, setCardUpdated] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  useDocumentTitle(
    subscription ? `${subscription.plan_name} Billing Portal` : "Billing Portal",
  );

  const handleAuthError = useCallback(() => {
    clearPortalSession();
    if (slug) {
      navigate({ to: "/portal/access/$tokenSlug", params: { tokenSlug: slug }, replace: true });
    } else {
      navigate({ to: "/", replace: true });
    }
  }, [navigate, slug]);

  async function handleNombaCardUpdate() {
    const clientId = NOMBA_CLIENT_ID;
    const accountId = NOMBA_ACCOUNT_ID;
    if (!clientId || !accountId) {
      return;
    }

    setCardUpdating(true);

    try {
      await useNombaCheckout({
        accountId,
        clientId,
        environment: isTestMode() ? "sandbox" : "live",
        order: {
          callbackUrl: window.location.origin + "/portal/dashboard",
          customerEmail: "",
          amount: "0.00",
          currency: "NGN",
        },
        tokenizeCard: "true",
        onCreateOrder: () => {},
        onFailure: (err) => {
          setCardUpdating(false);
        },
        onClose: () => {
          setCardUpdating(false);
        },
        onPaymentSuccess: async (response) => {
          setCardUpdating(false);
          const tokenKey =
            (response as any)?.tokenKey ??
            (response as any)?.tokenizedCardData?.tokenKey ??
            (response as any)?.data?.tokenKey;
          const cardType =
            (response as any)?.cardType ??
            (response as any)?.tokenizedCardData?.cardType;
          const cardLast4 =
            (response as any)?.cardLast4Digits ??
            (response as any)?.tokenizedCardData?.cardLast4Digits;

          if (tokenKey) {
            updateCard.mutate(
              {
                payment_token: tokenKey,
                card_brand: cardType,
                card_last4: cardLast4,
              },
              {
                onSuccess: () => {
                  setCardUpdated(true);
                  setShowUpdateCard(false);
                  setTimeout(() => setCardUpdated(false), 3000);
                },
                onError: () => {
                  handleAuthError();
                },
              },
            );
          }
        },
      });
    } catch {
      setCardUpdating(false);
    }
  }

  function handleCancelConfirm() {
    cancelSub.mutate(undefined, {
      onSuccess: () => setShowCancel(false),
      onError: () => handleAuthError(),
    });
  }

  function handlePauseConfirm() {
    pauseSub.mutate(undefined, {
      onSuccess: () => setShowPause(false),
      onError: () => handleAuthError(),
    });
  }

  function handleResume() {
    resumeSub.mutate(undefined, {
      onError: () => handleAuthError(),
    });
  }

  function handlePinChange(e: React.FormEvent) {
    e.preventDefault();
    setPinError("");
    setPinSuccess(false);

    if (newPin.length < 6) {
      setPinError("New PIN must be 6 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("PINs do not match");
      return;
    }

    updatePin.mutate(
      { current_pin: currentPin, new_pin: newPin },
      {
        onSuccess: () => {
          setPinSuccess(true);
          setCurrentPin("");
          setNewPin("");
          setConfirmPin("");
          setTimeout(() => setPinSuccess(false), 3000);
        },
        onError: () => {
          setPinError("Current PIN is incorrect. Try again.");
        },
      },
    );
  }

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!subscription || error) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6">
        <DangerTriangle weight="BoldDuotone" className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            We couldn&apos;t find this subscription
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your session may have expired.
          </p>
          <Button
            variant="default"
            size="sm"
            className="mt-4 min-h-[44px]"
            onClick={() => {
              clearPortalSession();
              if (slug) {
                navigate({ to: "/portal/access/$tokenSlug", params: { tokenSlug: slug }, replace: true });
              } else {
                navigate({ to: "/", replace: true });
              }
            }}
          >
            Re-enter PIN
          </Button>
        </div>
      </div>
    );
  }

  const needsBanner = ["past_due", "dunning", "suspended"].includes(subscription.status);
  const isActive = ["active", "trialing", "past_due", "dunning"].includes(subscription.status);
  const isPaused = subscription.status === "paused";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Subscription
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your {subscription.plan_name} subscription
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
                    onClick={handleNombaCardUpdate}
                    disabled={cardUpdating}
                  >
                    {cardUpdating ? "Opening…" : "Reactivate subscription"}
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
                    onClick={handleNombaCardUpdate}
                    disabled={cardUpdating}
                  >
                    {cardUpdating ? "Opening…" : "Update payment method"}
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
              <p className="text-base font-medium text-foreground">{subscription.plan_name}</p>
              <p className="mt-1 font-mono tabular-nums text-sm text-foreground">
                {subscription.currency} {formatAmount(subscription.amount)}
              </p>
            </div>
            <StatusBadge status={subscription.status} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {subscription.status === "trialing" && `Trial ends: ${formatDate(subscription.next_charge_date)}`}
            {subscription.status === "cancelled" && `Access until: ${formatDate(subscription.next_charge_date)}`}
            {!["trialing", "cancelled"].includes(subscription.status) && `Next charge: ${formatDate(subscription.next_charge_date)}`}
          </p>
        </div>

        <div className="border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground mb-3">
            Payment method
          </p>
          <div className="flex items-center gap-3">
            <Card weight="Linear" className="h-5 w-5 text-muted-foreground shrink-0" />
            {subscription.card_brand && subscription.card_last4 ? (
              <div>
                <p className="font-mono text-sm text-foreground">
                  •••• •••• •••• {subscription.card_last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription.card_brand}
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
            onClick={handleNombaCardUpdate}
            disabled={cardUpdating}
          >
            {cardUpdating ? "Opening…" : "Update card"}
          </Button>
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-foreground mb-3">Recent payments</h2>
        <DataTable<PortalPaymentRead & { id: string }>
          columns={[
            { key: "date", header: "Date", cell: (r) => <span className="text-sm text-foreground">{formatDate(r.date)}</span> },
            {
              key: "amount",
              header: "Amount",
              cell: (r) => (
                <span className="font-mono tabular-nums text-sm text-foreground">
                  {r.currency} {formatAmount(r.amount)}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              cell: (r) => (
                <StatusBadge status={r.status} />
              ),
            },
          ]}
          data={(billing ?? []).map((r, i) => ({ ...r, id: `pmt_${i}` }))}
          emptyMessage="No billing records yet."
          renderMobileCard={(r) => (
            <div className="flex items-center justify-between px-4 py-3 min-h-[44px]">
              <div>
                <p className="font-mono tabular-nums text-sm text-foreground">
                  {r.currency} {formatAmount(r.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          )}
        />
      </div>

      {/* Pause / Resume + Cancel */}
      <div className="mt-8 border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {isPaused ? (
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              onClick={handleResume}
            >
              Resume subscription
            </Button>
          ) : isActive ? (
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              onClick={() => setShowPause(true)}
            >
              Pause subscription
            </Button>
          ) : null}
          {isActive && (
            <Button
              variant="destructive"
              className="flex-1 min-h-[44px]"
              onClick={() => setShowCancel(true)}
            >
              Cancel subscription
            </Button>
          )}
        </div>
      </div>

      {/* PIN Change */}
      <div className="mt-8 border border-border bg-card p-5">
        <button
          type="button"
          onClick={() => setShowPinChange(!showPinChange)}
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Eye weight="Linear" className="h-4 w-4" />
          {showPinChange ? "Hide PIN settings" : "Change portal PIN"}
        </button>

        {showPinChange && (
          <form onSubmit={handlePinChange} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground" htmlFor="current-pin">Current PIN</label>
              <Input
                id="current-pin"
                type="password"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 font-mono tracking-widest min-h-[44px]"
                placeholder="000000"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-foreground" htmlFor="new-pin">New PIN</label>
                <Input
                  id="new-pin"
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-1 font-mono tracking-widest min-h-[44px]"
                  placeholder="000000"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-foreground" htmlFor="confirm-pin">Confirm PIN</label>
                <Input
                  id="confirm-pin"
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-1 font-mono tracking-widest min-h-[44px]"
                  placeholder="000000"
                />
              </div>
            </div>
            {pinError && <p className="text-sm text-destructive">{pinError}</p>}
            {pinSuccess && (
              <p className="text-sm text-emerald-500">PIN changed successfully</p>
            )}
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="min-h-[44px]"
              disabled={updatePin.isPending || currentPin.length < 6 || newPin.length < 6 || newPin !== confirmPin}
            >
              {updatePin.isPending ? "Updating…" : "Update PIN"}
            </Button>
          </form>
        )}
      </div>

      {/* Card Updated Success */}
      {cardUpdated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-emerald-500/10">
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
          <div className="w-full max-w-sm border border-border bg-card p-6">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Cancel your subscription?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ll keep access until {formatDate(subscription.next_charge_date)}. This can&apos;t be undone.
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
          <div className="w-full max-w-sm border border-border bg-card p-6">
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
