import { Link } from "@tanstack/react-router"
import { AltArrowRight } from "@/lib/icons"

export interface NotFoundProps {
  message?: string
}

function NotFound({ message }: NotFoundProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)]">
      <span className="text-sm font-bold tracking-widest text-orange-500 uppercase">
        404
      </span>
      <h1 className="text-4xl font-extrabold tracking-tight mt-2">
        Page not found
      </h1>
      <p className="text-base text-zinc-400 mt-3 text-center max-w-md">
        {message ?? "Sorry, we couldn't find the dashboard route or documentation path you're looking for."}
      </p>
      <div className="flex items-center gap-4 mt-8">
        <Link
          to="/"
          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
        >
          Back to dashboard
        </Link>
        <Link
          to="/docs"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          View documentation
          <AltArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

export { NotFound }
