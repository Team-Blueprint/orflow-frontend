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
