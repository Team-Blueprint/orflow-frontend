import { type FormEvent, useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { apiClient } from "@/api/apiClient"
import { ApiKeyField } from "@/components/api-key-field"
import { LogoIcon } from "@/components/icons"

interface Keys {
  sk_test: string
  pk_test: string
  sk_live: string
  pk_live: string
}

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [keys, setKeys] = useState<Keys | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")

  async function handleCreateProject(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsCreating(true)
    try {
      const results = await Promise.all([
        apiClient.post("/v1/auth/keys/create", { key_type: "sk_test" }),
        apiClient.post("/v1/auth/keys/create", { key_type: "pk_test" }),
        apiClient.post("/v1/auth/keys/create", { key_type: "sk_live" }),
        apiClient.post("/v1/auth/keys/create", { key_type: "pk_live" }),
      ])

      const k: Keys = {
        sk_test: results[0].data.value,
        pk_test: results[1].data.value,
        sk_live: results[2].data.value,
        pk_live: results[3].data.value,
      }
      setKeys(k)

      localStorage.setItem("orflow_api_key", k.sk_test)
      setStep(2)
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.response?.data?.detail || "Failed to create API keys")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px rgb(24 24 27 / 0.4) inset !important;
          -webkit-text-fill-color: #fafafa !important;
          caret-color: #fafafa;
        }
      `}</style>
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-sm mx-auto">
          <a href="/" className="flex flex-col items-center justify-center mb-10 cursor-pointer group">
            <span className="flex items-center gap-2 text-2xl font-extrabold text-ink tracking-tight">
              <LogoIcon size={24} variant="orange" />
              Create a project on{" "}
              <span className="font-serif italic text-primary">Orflow</span>
            </span>
            <p className="text-sm text-ink-soft mt-1">
              Set up your project to start building on Nomba's infrastructure
            </p>
          </a>

          {step === 1 && (
            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div className="border border-primary/20 bg-primary-soft/30 px-4 py-3">
                <p className="text-xs text-ink-soft leading-relaxed">
                  We'll generate both <strong className="text-ink">sandbox</strong> and <strong className="text-ink">live</strong> API keys so you can develop and go to production seamlessly.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary w-full text-sm font-bold py-3 mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Generating keys..." : "Create project"}
              </button>
            </form>
          )}

          {step === 2 && keys && (
            <>
              <div className="text-center mb-10">
                <span className="text-2xl font-extrabold text-ink tracking-tight">
                  Your project is ready
                </span>
                <p className="text-sm text-ink-soft mt-1">
                  Save your API keys — you'll need them to authenticate requests
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                    Sandbox
                  </h3>
                  <div className="flex flex-col gap-4">
                    <ApiKeyField label="Secret key" value={keys.sk_test} prefix="sk_test_" />
                    <ApiKeyField label="Publishable key" value={keys.pk_test} prefix="pk_test_" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                    Live
                  </h3>
                  <div className="flex flex-col gap-4">
                    <ApiKeyField label="Secret key" value={keys.sk_live} prefix="sk_live_" />
                    <ApiKeyField label="Publishable key" value={keys.pk_live} prefix="pk_live_" />
                  </div>
                </div>

                <div className="border border-primary/20 bg-primary-soft/30 px-4 py-3">
                  <p className="text-xs text-ink-soft">
                    <span className="font-semibold text-primary">i</span> You can also find these keys in your project settings.
                  </p>
                </div>

                <button type="button" className="btn-primary w-full text-sm font-bold py-3 cursor-pointer" onClick={() => window.location.href = "/dashboard/proj_1"}>
                  Go to dashboard
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs text-ink-soft">Step {step} of 2</p>

          <p className="mt-6 text-center text-sm text-ink-soft">
            <button
              type="button"
              onClick={() => router.history.back()}
              className="font-semibold text-ink hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              &larr; Go back
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
