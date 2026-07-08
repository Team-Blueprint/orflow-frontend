import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/lib/auth"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
})

function SignIn() {
  const { isAuthenticated, isLoading, login } = useAuth()
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

  return (
    <>
      <AuthForm mode="sign-in" />

      {/* Demo Panel */}
      <div className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-none py-3 px-4">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-lg font-semibold">Demo Accounts</h2>
          <p className="text-gray-600">Launch a live merchant workspace instantly</p>
          <button
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
            onClick={() => {
              login('adebayo.olumide.biz@gmail.com', 'hackathon123')
            }}
          >
            Launch Workspace
          </button>
        </div>
      </div>
    </>
  );
}
