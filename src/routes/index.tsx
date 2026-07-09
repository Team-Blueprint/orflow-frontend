import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/layout";
import {
  Hero,
  PainPoints,
  CodeSnippet,
  DesignedForDevs,
  Testimonial,
  Security,
  Integrations,
  CtaBanner,
  Faq,
} from "@/components/landing";
import { ArrowUp } from "@/lib/icons";

export const Route = createFileRoute("/")({
  component: Home,
});

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center bg-primary text-white shadow-lg transition-all duration-200 hover:brightness-110 cursor-pointer ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

function useSeoMeta() {
  useEffect(() => {
    const origin = window.location.origin;
    const title = "Orflow — Recurring Billing for Nomba";
    const desc = "Build, manage, and scale recurring billing on Nomba. Launch a merchant workspace in seconds.";
    const img = `${origin}/hero.png`;

    document.title = title;
    setMeta("description", desc);
    setMeta("og:title", title);
    setMeta("og:description", desc);
    setMeta("og:image", img);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", img);
  }, []);
}

function setMeta(prop: string, content: string) {
  const key = prop.includes(":") ? "property" : "name";
  let el = document.querySelector(`meta[${key}="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function Home() {
  useSeoMeta();
  return (
    <>
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 text-center text-sm text-amber-800">
          👉 Quick Demo: Skip onboarding and try real database environments instantly! Launch the <a href="/sign-in" className="font-semibold underline">Live Merchant Dashboard Sandbox</a> or access the <a href="/portal/access" className="font-semibold underline">Customer Self-Service Billing Portal</a>.
        </div>
      </div>
      <main>
        <Hero />
        <PainPoints />
        <CodeSnippet />
        {/* <ConsoleSplit /> */}
        <DesignedForDevs />
        <Testimonial />
        <Security />
        <Integrations />
        <CtaBanner />
        <Faq />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
