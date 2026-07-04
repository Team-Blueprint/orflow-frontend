import { useState, type FormEvent } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account-layout"
import { apiClient } from "@/api/apiClient"
import { AxiosError } from "axios"

export const Route = createFileRoute("/dashboard/new")({
  component: NewProject,
})

function NewProject() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsCreating(true)
    try {
      const { data } = await apiClient.post("/v1/projects/create", { name, description })
      navigate({ to: "/dashboard/$projectId", params: { projectId: data.id } })
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setError(err.response.data.error.message)
      } else if (err instanceof AxiosError && err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Failed to create project. Please try again.")
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AccountLayout breadcrumb="New Project">
      <div className="mx-auto max-w-lg p-4 sm:px-8 sm:pt-4 sm:pb-8">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Create a project</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
            Set up a new project to start building recurring billing on Nomba
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Project name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My SaaS App"
              required
              className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Description <span className="text-ink-soft/60">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your project"
              rows={3}
              className="w-full bg-zinc-900/40 border border-hairline text-sm text-ink px-4 py-3 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="btn-primary w-full text-sm font-bold py-3 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating project..." : "Create project"}
          </button>
        </form>
      </div>
    </AccountLayout>
  )
}
