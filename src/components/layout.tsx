import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GithubIcon, LogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sticky top-0 z-50">
      <nav className="flex items-center justify-between h-14 bg-zinc-950/80 backdrop-blur-lg border border-hairline px-6 w-full shadow-none">
        <a
          href="/"
          className="font-sans font-bold text-sm text-white tracking-tight flex items-center gap-2 cursor-pointer"
        >
          <LogoIcon size={18} variant="white" />
          Orflow
        </a>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide text-ink-soft">
          <a
            href="/docs"
            className="transition-colors hover:text-white cursor-pointer"
          >
            Docs
          </a>
          <a
            href="#developers"
            className="transition-colors hover:text-white cursor-pointer"
          >
            Developers
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-white cursor-pointer"
          >
            FAQ
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/Team-Blueprint/orflow-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft transition-colors hover:text-white cursor-pointer"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <Link
            to="/sign-in"
            className="text-xs font-medium text-ink-soft transition-colors hover:text-white cursor-pointer"
          >
            Log in
          </Link>
          <Button asChild className="text-xs px-4 py-1.5 h-auto font-semibold">
            <Link to="/sign-up">Get started</Link>
          </Button>
        </div>

        <button
          className="flex items-center cursor-pointer md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ minHeight: 44, minWidth: 44 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-zinc-400"
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border border-hairline px-6 py-4 md:hidden bg-zinc-950 mt-1">
          <div className="flex flex-col gap-4">
            <a
              href="/docs"
              className="text-xs font-medium text-ink-soft transition-colors hover:text-white cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Docs
            </a>
            <a
              href="#developers"
              className="text-xs font-medium text-ink-soft transition-colors hover:text-white cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Developers
            </a>
            <a
              href="#faq"
              className="text-xs font-medium text-ink-soft transition-colors hover:text-white cursor-pointer"
              onClick={() => setOpen(false)}
            >
              FAQ
            </a>
            <hr className="border-hairline" />
            <Link
              to="/sign-in"
              className="text-xs font-medium text-ink-soft transition-colors hover:text-white cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <a
              href="https://github.com/Team-Blueprint/orflow-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-ink-soft transition-colors hover:text-white cursor-pointer"
            >
              <GithubIcon size={18} />
              GitHub
            </a>
            <Button
              asChild
              className="w-full text-xs px-5 py-3 h-auto font-semibold"
            >
              <Link to="/sign-up" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const footerColumns = {
  Product: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-reference" },
    { label: "Pricing", href: "#pricing" },
  ],
  Developers: [
    {
      label: "GitHub",
      href: "https://github.com/Team-Blueprint/orflow-backend",
    },
    { label: "API Docs", href: "/docs" },
    { label: "Open Source", href: "https://github.com/Team-Blueprint/orflow-backend" },
  ],
  Company: [
    { label: "Team Blueprint", href: "https://github.com/Team-Blueprint" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <a
              href="/"
              className="text-base font-semibold tracking-tight text-white flex items-center gap-2 cursor-pointer"
            >
              <LogoIcon size={18} variant="orange" />
              Orflow
            </a>
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              Recurring billing for Nomba merchants. No rebuild required.
            </p>
          </div>
          {Object.entries(footerColumns).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-500 transition-colors duration-150 hover:text-zinc-300 cursor-pointer"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Team Blueprint. Built for the
            Nomba Hackathon 2026.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-zinc-600 transition-colors duration-150 hover:text-zinc-400 cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-zinc-600 transition-colors duration-150 hover:text-zinc-400 cursor-pointer"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
