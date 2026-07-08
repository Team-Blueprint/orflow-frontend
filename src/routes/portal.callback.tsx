import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { apiClient } from "@/api/apiClient";
import { setPortalSlug } from "@/lib/portal-auth";
import { CheckCircle, DangerTriangle } from "@solar-icons/react";

export const Route = createFileRoute("/portal/callback")({
  component: PortalCallbackPage,
});

interface VerifyCheckoutResponse {
  success: boolean
  status: string
  subscription_id: string | null
  portal_token_slug?: string
  customer_name?: string
}

type CallbackState =
  | { status: "loading" }
  | { status: "success"; slug: string | null; name: string | null }
  | { status: "failed"; message: string }

function PortalCallbackPage() {
  const { orderId, orderReference } = useSearch({ from: "/portal/callback" }) as {
    orderId?: string
    orderReference?: string
  }
  const navigate = useNavigate()
  const [state, setState] = useState<CallbackState>({ status: "loading" })

  useEffect(() => {
    const ref = orderReference || orderId
    if (!ref) {
      setState({ status: "failed", message: "No order reference found in callback URL." })
      return
    }

    apiClient
      .get<VerifyCheckoutResponse>("/v1/portal/verify-checkout", {
        params: { orderReference: ref },
      })
      .then((res) => {
        if (res.data.success && res.data.portal_token_slug) {
          setPortalSlug(res.data.portal_token_slug)
          navigate({
            to: "/portal/access/$tokenSlug",
            params: { tokenSlug: res.data.portal_token_slug },
            replace: true,
          })
        } else if (res.data.success) {
          setState({
            status: "success",
            slug: null,
            name: res.data.customer_name ?? null,
          })
        } else {
          setState({
            status: "failed",
            message: "Payment verification failed. Please try again or contact support.",
          })
        }
      })
      .catch(() => {
        setState({
          status: "failed",
          message: "Could not verify payment. Please check your email for portal access.",
        })
      })
  }, [orderId, orderReference, navigate])

  if (state.status === "loading") {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying payment…</p>
        </div>
      </div>
    )
  }

  if (state.status === "success") {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-emerald-500/10">
            <CheckCircle weight="BoldDuotone" className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Payment successful!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Check your email for a 6-digit PIN to access your self-service portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-red-500/10">
          <DangerTriangle weight="BoldDuotone" className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Verification failed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      </div>
    </div>
  )
}
