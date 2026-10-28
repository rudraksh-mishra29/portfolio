import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Portfolio = lazy(() => import("@/components/portfolio/Portfolio"));
export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
  head: () => ({
    meta: [
      { title: "Rudraksh — AI Engineer & Creative Builder" },
      {
        name: "description",
        content:
          "Enter Rudraksh’s digital universe. AI engineering, full-stack development, and creative building — a B.Tech student of Artificial Intelligence & Data Science at JECRC University.",
      },
      { property: "og:title", content: "Rudraksh — A digital universe" },
      {
        property: "og:description",
        content:
          "AI Engineer. Full Stack Developer. Creative Builder. B.Tech in Artificial Intelligence & Data Science at JECRC University.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Rudraksh",
          jobTitle: "AI Engineer | Full Stack Developer | Creative Builder",
          alumniOf: {
            "@type": "EducationalOrganization",
            name: "JECRC University",
          },
          knowsAbout: ["Artificial Intelligence", "Data Science", "Full Stack Development"],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Portfolio />
    </Suspense>
  );
}
