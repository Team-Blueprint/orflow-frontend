import { useEffect, type ReactNode } from "react"
import { useAuth } from "@/lib/auth"
import { useNavigate } from "@tanstack/react-router"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/sign-in" })
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
