import { createFileRoute } from "@tanstack/react-router"
import { AuthForm } from "@/components/auth-form"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
})

function SignIn() {
  return <AuthForm mode="sign-in" />
}
