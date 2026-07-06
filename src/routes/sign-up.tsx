import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/lib/auth"

export const Route = createFileRoute("/sign-up")({
  component: SignUp,
})

function SignUp() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/dashboard" })
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas"><div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" /></div>
  }

  if (isAuthenticated) return null

  return <AuthForm mode="sign-up" />
}
