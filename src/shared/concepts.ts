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
  {
    slug: "blueprint",
    number: "04",
    name: "Blueprint",
    thesis: "An engineering drawing set. Every section is a numbered sheet with a title block.",
    palette: ["#eef2f6", "#1d3fbf", "#f26b1d"],
  },
  {
    slug: "counter",
    number: "05",
    name: "The Counter",
    thesis: "A supply-house counter. Slab type, an awning stripe, and a paper work ticket.",
    palette: ["#faf6ee", "#17233d", "#1f7a4d"],
  },
  {
    slug: "grid",
    number: "06",
    name: "Grid",
    thesis: "Black on white modernism. An exposed grid, a rail that fills as you scroll, color only in the photographs.",
    palette: ["#ffffff", "#0a0a0a", "#8a8f98"],
  },
] as const;

export type ConceptSlug = (typeof concepts)[number]["slug"];

export function scrollTo(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}
