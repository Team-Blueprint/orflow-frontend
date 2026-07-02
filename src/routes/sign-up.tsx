import { createFileRoute } from "@tanstack/react-router"
import { AuthForm } from "@/components/auth-form"

export const Route = createFileRoute("/sign-up")({
  component: SignUp,
})

function SignUp() {
  return <AuthForm mode="sign-up" />
}
