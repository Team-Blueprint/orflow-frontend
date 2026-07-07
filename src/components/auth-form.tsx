import { type FormEvent, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { LogoIcon } from "@/components/icons"
import { useAuth } from "@/lib/auth"
import { BASE_URL } from "@/api/apiClient"
import { AxiosError } from "axios"

interface AuthFormProps {
  mode: "sign-in" | "sign-up"
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSignIn = mode === "sign-in"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      if (isSignIn) {
        await login(email, password)
      } else {
        await signup(name, email, password)
        navigate({ to: "/dashboard" })
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setError(err.response.data.error.message)
      } else if (err instanceof AxiosError && err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
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
              {isSignIn ? "Log in to " : "Create an account on "}
              <span className="font-serif italic text-primary">Orflow</span>
            </span>
            <p className="text-sm text-ink-soft mt-1">
              {isSignIn
                ? "Sign in to your Orflow dashboard"
                : "Start building recurring billing on Nomba"}
            </p>
          </a>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isSignIn && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgba(24,24,27,0.4)] autofill:text-ink"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgba(24,24,27,0.4)] autofill:text-ink"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Password
                </label>
                {isSignIn && (
                  <a href="#" className="text-xs text-ink-soft hover:text-ink transition-colors cursor-pointer">
                    Forgot?
                  </a>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignIn ? "Enter your password" : "Create a password"}
                required
                minLength={8}
                autoComplete={isSignIn ? "current-password" : "new-password"}
                className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgba(24,24,27,0.4)] autofill:text-ink"
              />
            </div>

            {!isSignIn && (
              <p className="text-xs text-zinc-500 -mt-1">
                Must be at least 8 characters
              </p>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-sm font-bold py-3 mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isSignIn ? "Signing in..." : "Creating account...") : (isSignIn ? "Sign in" : "Create account")}
            </button>
          </form>

          <div className="my-8 flex items-center justify-between text-xs font-medium text-ink-soft">
            <div className="h-px flex-1 bg-hairline" />
            <span className="mx-4">or</span>
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <div className="flex flex-col gap-3">
{/* Continue with GitHub - not yet implemented
            <a
              href="https://github.com/Team-Blueprint/orflow-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-zinc-900/30 hover:bg-zinc-900/60 border border-hairline text-ink text-xs font-semibold py-3 flex items-center justify-center gap-3 cursor-pointer transition-colors"
            >
              <GithubIcon size={18} />
              Continue with GitHub
            </a>
*/}
            <a
              href={`${BASE_URL}/api/auth/google/login`}
              className="w-full bg-zinc-900/30 hover:bg-zinc-900/60 border border-hairline text-ink text-xs font-semibold py-3 flex items-center justify-center gap-3 cursor-pointer transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </a>
          </div>

          <p className="mt-8 text-center text-sm text-ink-soft">
            {isSignIn ? (
              <>
                Don't have an account?{" "}
                <Link to="/sign-up" className="font-semibold text-ink hover:text-primary transition-colors cursor-pointer">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/sign-in" className="font-semibold text-ink hover:text-primary transition-colors cursor-pointer">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  )
}
