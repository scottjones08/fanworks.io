export const navItems = [
  { id: "ledger", label: "The day" },
  { id: "system", label: "The layer" },
  { id: "adopt", label: "People" },
  { id: "approach", label: "Approach" },
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

export const dayCards = [
  {
    time: "7:04",
    stamp: "7:04 AM",
    index: "01 / 06",
    before: "The day starts in three systems and a spreadsheet that only one person understands.",
    after: "One screen shows the whole floor.",
    icon: "screens",
    room: "Front office",
    zone: "ops",
    focus: { x: 140, y: 100 },
  },
  {
    time: "9:20",
    stamp: "9:20 AM",
    index: "02 / 06",
    before: "An order is retyped for the third time — quote, job ticket, invoice.",
    after: "Entered once. Everywhere at once.",
    icon: "copy",
    room: "Order desk",
    zone: "intake",
    focus: { x: 420, y: 100 },
  },
  {
    time: "11:45",
    stamp: "11:45 AM",
    index: "03 / 06",
    before: "“Who owns this?” travels four inboxes before lunch.",
    after: "Every job carries one name.",
    icon: "inbox",
    room: "Planning",
    zone: "plan",
    focus: { x: 700, y: 100 },
  },
  {
    time: "1:30",
    stamp: "1:30 PM",
    index: "04 / 06",
    before: "The same job gets done five different ways, depending on who's in.",
    after: "One way. Written down. Followed.",
    icon: "list",
    room: "Shop floor",
    zone: "shop",
    focus: { x: 700, y: 392 },
  },
  {
    time: "3:15",
    stamp: "3:15 PM",
    index: "05 / 06",
    before: "A stockout is discovered at the dock, with the truck already waiting.",
    after: "The system flagged it Tuesday.",
    icon: "dock",
    room: "Warehouse",
    zone: "dock",
    focus: { x: 420, y: 392 },
  },
  {
    time: "6:00",
    stamp: "6:00 PM",
    index: "06 / 06",
    before: "You used to leave with questions.",
    after: "Now you leave with numbers.",
    icon: "chart",
    room: "Close-out",
    zone: "close",
    focus: { x: 140, y: 392 },
    finale: true,
  },
] as const;

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
