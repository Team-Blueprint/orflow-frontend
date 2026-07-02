import { createFileRoute } from "@tanstack/react-router"
import { OnboardingForm } from "@/components/onboarding-form"

export const Route = createFileRoute("/new")({
  component: Onboarding,
})

function Onboarding() {
  return <OnboardingForm />
}
