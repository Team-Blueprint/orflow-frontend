import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useConfirmCardUpdate } from "@/lib/portal-queries";
import { CheckCircle, DangerTriangle } from "@solar-icons/react";

export const Route = createFileRoute("/portal/card-update-callback")({
  component: PortalCardUpdateCallback,
});

type CallbackState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "failed"; message: string }

function PortalCardUpdateCallback() {
  const { orderReference } = useSearch({ from: "/portal/card-update-callback" }) as {
    orderReference?: string
  }
  const navigate = useNavigate()
  const confirmCardUpdate = useConfirmCardUpdate()
  const [state, setState] = useState<CallbackState>({ status: "loading" })

  useEffect(() => {
    if (!orderReference) {
      setState({ status: "failed", message: "No order reference found in callback URL." })
      return
    }

    confirmCardUpdate.mutate(
      { order_reference: orderReference },
      {
        onSuccess: () => {
          setState({ status: "success" })
          setTimeout(() => {
            navigate({ to: "/portal/dashboard", replace: true })
          }, 2000)
        },
        onError: () => {
          setState({ status: "failed", message: "Could not verify card update. Please return to dashboard and try again." })
        },
      },
    )
  }, [orderReference])

  if (state.status === "loading") {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying card update…</p>
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
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Card updated!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting to dashboard…
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
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Update failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      </div>
    </div>
  )
}
