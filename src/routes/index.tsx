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

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Nav />
      <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-sm text-amber-800">
        👉 Quick Demo: Skip onboarding and try real database environments instantly! Launch the <a href="/sign-in" className="font-semibold underline">Live Merchant Dashboard Sandbox</a> or access the <a href="/portal/access" className="font-semibold underline">Customer Self-Service Billing Portal</a>.
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
    </>
  );
}
