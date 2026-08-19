export const navItems = [
  { id: "system", label: "The layer" },
  { id: "frictions", label: "Frictions" },
  { id: "approach", label: "Approach" },
  { id: "adopt", label: "People" },
] as const;

export const frictionWords = [
  "disconnected systems",
  "manual work",
  "unclear ownership",
  "inconsistent processes",
  "lack of visibility",
];

export const lineStages = [
  "Intake",
  "Quote",
  "Order",
  "Schedule",
  "Production",
  "Delivery",
  "Invoice",
] as const;

export const tickerCopy =
  "Intake ⟶ Quote ⟶ Order ⟶ Schedule ⟶ Production ⟶ Delivery ⟶ Invoice ⟶ Feedback  ·  One line, end to end  ·  ";

export const frictions = [
  {
    number: "01",
    name: "Disconnected systems",
    line: "Your tools do not talk to each other, so your people translate.",
    icon: "unlink",
  },
  {
    number: "02",
    name: "Manual work",
    line: "Copying, chasing, checking — hours a day, invisible on any report.",
    icon: "manual",
  },
  {
    number: "03",
    name: "Unclear ownership",
    line: "Good work stalls between people because no one holds the ball.",
    icon: "tag",
  },
  {
    number: "04",
    name: "Inconsistent process",
    line: "The same job, five ways — quality rides on who showed up.",
    icon: "fork",
  },
  {
    number: "05",
    name: "Lack of visibility",
    line: "You find out what went wrong after it already cost you.",
    icon: "blind",
  },
] as const;

export const principles = [
  {
    number: "01",
    title: "See the real work.",
    body: "Not the org chart. Not the process doc. We sit with your team and watch how the day actually runs — where it flows, and where it grinds.",
  },
  {
    number: "02",
    title: "Fix what matters.",
    body: "Not everything at once. We rank the frictions by what they cost you, and start with the one creating the most drag on the business.",
  },
  {
    number: "03",
    title: "Leave it simpler.",
    body: "No black boxes, no dependency on us. We build a better way your team can understand, run, and own after we're gone.",
  },
] as const;

export const practices = [
  {
    name: "Health",
    line: "Patient intake, scheduling, and records that follow the visit — not the other way around.",
    tags: "Clinics · Practices",
    icon: "health",
  },
  {
    name: "Wealth",
    line: "Client onboarding, compliance trails, and reporting that runs itself between reviews.",
    tags: "Advisories · Family offices",
    icon: "wealth",
  },
  {
    name: "Manufacturing",
    line: "Quote to job ticket to dock — one line the floor can see and the office can trust.",
    tags: "Plants · Job shops",
    icon: "plant",
  },
  {
    name: "Retail",
    line: "Inventory, orders, and fulfillment reconciled in one place — before the customer asks.",
    tags: "Stores · E-commerce",
    icon: "bag",
  },
  {
    name: "Legal",
    line: "Matter intake, deadlines, and documents tracked from engagement letter to close.",
    tags: "Firms · In-house teams",
    icon: "legal",
  },
] as const;

export const kpis = [
  { name: "Cycle time", delta: "↓ 38%", width: 74 },
  { name: "Throughput", delta: "↑ 24%", width: 88 },
  { name: "Gross margin", delta: "↑ 6 pts", width: 66 },
  { name: "On-time delivery", delta: "↑ 98%", width: 92 },
] as const;

export function scrollToId(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}
