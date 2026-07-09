import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/lib/auth"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
})

function SignIn() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const [demoError, setDemoError] = useState("")
  const [demoLoading, setDemoLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/dashboard" })
    }
  }, [isAuthenticated, isLoading])

  async function handleDemoLogin() {
    setDemoError("")
    setDemoLoading(true)
    try {
      await login('adebayo.olumide.biz@gmail.com', 'hackathon123')
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.detail
        || err?.message
        || "Could not launch demo workspace. Please try again."
      setDemoError(msg)
    } finally {
      setDemoLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas"><div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" /></div>
  }

  if (isAuthenticated) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <AuthForm mode="sign-in" embedded />

        <div className="border border-hairline bg-muted/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">Quick Demo Access</p>
          <p className="text-sm text-ink-soft mb-3">Launch a live merchant workspace instantly</p>
          <button
            className="btn-primary w-full text-sm font-bold py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={demoLoading}
            onClick={handleDemoLogin}
          >
            {demoLoading ? "Launching…" : "Launch Workspace"}
          </button>
          {demoError && (
            <p className="mt-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">
              {demoError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
