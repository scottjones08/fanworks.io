export const concepts = [
  {
    slug: "line",
    number: "01",
    name: "The Operating Line",
    thesis: "Editorial and exact. A consulting firm that reads like a well-run ledger.",
    palette: ["#f4f1ea", "#151412", "#e0431f"],
  },
  {
    slug: "signal",
    number: "02",
    name: "Signal",
    thesis: "Dark, technical, AI-native. The operating layer as a product you can see running.",
    palette: ["#0b0c10", "#c8ff5e", "#8b93a7"],
  },
  {
    slug: "studio",
    number: "03",
    name: "Studio",
    thesis: "Warm, human, photographic. People first, and it looks like it.",
    palette: ["#f3ede3", "#c4633a", "#1f3d2e"],
  },
] as const;

export type ConceptSlug = (typeof concepts)[number]["slug"];

export function scrollTo(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}
