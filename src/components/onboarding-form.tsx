import { type FormEvent, useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { ApiKeyField } from "@/components/api-key-field"
import { LogoIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type Env = "sandbox" | "live"

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [environment, setEnvironment] = useState<Env>("sandbox")
  const [apiKey] = useState("sk_test_4f3c2a1b8d7e6f5c")
  const [publishableKey] = useState("pk_test_8d7e6f5c4f3c2a1b")

  function handleCreateProject(e: FormEvent) {
    e.preventDefault()
    setStep(2)
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
              <div className="flex flex-col gap-1.5">
                <label htmlFor="project-name" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Project name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My SaaS App"
                  required
                  className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgba(24,24,27,0.4)] autofill:text-ink"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="project-desc" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Description{" "}
                  <span className="font-normal normal-case tracking-normal text-ink-soft/60">
                    (optional)
                  </span>
                </label>
                <input
                  id="project-desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Subscription platform for..."
                  className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgba(24,24,27,0.4)] autofill:text-ink"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Environment
                </label>
                <div className="flex border border-hairline">
                  {(["sandbox", "live"] as Env[]).map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setEnvironment(env)}
                      className={cn(
                        "flex-1 px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer",
                        environment === env
                          ? "bg-primary text-white"
                          : "bg-transparent text-ink hover:bg-zinc-900/60",
                      )}
                    >
                      {env === "sandbox" ? "Sandbox" : "Live"}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full text-sm font-bold py-3 mt-1 cursor-pointer">
                Create project
              </button>
            </form>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-10">
                <span className="text-2xl font-extrabold text-ink tracking-tight">
                  Your project is ready
                </span>
                <p className="text-sm text-ink-soft mt-1">
                  Save your API keys — you'll need them to authenticate requests
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <ApiKeyField
                  label="Secret key"
                  value={apiKey}
                  prefix="sk_test_"
                />
                <ApiKeyField
                  label="Publishable key"
                  value={publishableKey}
                  prefix="pk_test_"
                />

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
