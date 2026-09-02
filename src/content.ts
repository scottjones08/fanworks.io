export const navItems = [
  { id: "diagnostic", label: "Map the day" },
  { id: "method", label: "How we work" },
  { id: "industries", label: "Industries" },
  { id: "proof", label: "Why FanWorks" },
] as const;

export const stages = [
  {
    id: "intake",
    label: "Intake",
    before: "A request lands in an inbox, a voicemail, and somebody's notebook.",
    after: "One intake. One owner. Everyone sees what arrived.",
  },
  {
    id: "quote",
    label: "Quote",
    before: "The same details are hunted down again before anyone can price the work.",
    after: "The right context follows the request into the quote.",
  },
  {
    id: "order",
    label: "Order",
    before: "The order is retyped into the system that the next team happens to use.",
    after: "Entered once. Ready everywhere it needs to go.",
  },
  {
    id: "schedule",
    label: "Schedule",
    before: "People reconcile calendars, capacity, and promises by hand.",
    after: "Capacity and commitments share the same operating picture.",
  },
  {
    id: "production",
    label: "Production",
    before: "Questions travel back upstream while the work waits on the floor.",
    after: "The job arrives with the decisions, materials, and owner attached.",
  },
  {
    id: "delivery",
    label: "Delivery",
    before: "A missing handoff is discovered when the customer is already waiting.",
    after: "Exceptions surface early enough for the team to act.",
  },
  {
    id: "invoice",
    label: "Invoice",
    before: "The final numbers are reconstructed from three versions of what happened.",
    after: "The completed work closes the loop without another round of translation.",
  },
] as const;

export const tools = [
  "Email",
  "Sheets",
  "ERP",
  "CRM",
  "Paper",
  "Texts",
  "Drive",
  "Scheduler",
  "Accounting",
  "Whiteboard",
] as const;

export const frictions = [
  {
    id: "disconnected",
    number: "01",
    label: "Disconnected systems",
    short: "People translate between tools that never meet.",
  },
  {
    id: "manual",
    number: "02",
    label: "Manual work",
    short: "Copying, chasing, and checking consume the day.",
  },
  {
    id: "ownership",
    number: "03",
    label: "Unclear ownership",
    short: "Good work stalls because no one holds the next move.",
  },
  {
    id: "inconsistent",
    number: "04",
    label: "Inconsistent process",
    short: "The same job takes a different path depending on who is in.",
  },
  {
    id: "visibility",
    number: "05",
    label: "Lack of visibility",
    short: "The problem appears only after it has become expensive.",
  },
] as const;

export const methods = [
  {
    number: "01",
    verb: "Observe",
    title: "See the real work.",
    body: "We sit beside the people doing it and watch the handoffs, workarounds, and decisions a process map misses.",
  },
  {
    number: "02",
    verb: "Map",
    title: "Name the drag.",
    body: "Together, we trace the work end to end and rank the friction by what it costs the team and the customer.",
  },
  {
    number: "03",
    verb: "Rebuild",
    title: "Connect what matters.",
    body: "We simplify the operating layer underneath the day—using automation and AI only where they earn a place.",
  },
  {
    number: "04",
    verb: "Hand off",
    title: "Leave it owned.",
    body: "Your people train in the new way, understand why it works, and keep improving it without depending on us.",
  },
] as const;

export const industries = [
  {
    id: "manufacturing",
    label: "Manufacturing",
    eyebrow: "Plants · Job shops",
    headline: "From quote to dock, without the scavenger hunt.",
    body: "Connect estimating, job tickets, materials, scheduling, production, and delivery so the floor sees what the office promised.",
    flow: ["Quote", "Job ticket", "Schedule", "Build", "Quality", "Dock"],
  },
  {
    id: "health",
    label: "Health",
    eyebrow: "Clinics · Practices",
    headline: "Let the visit lead. Let the systems follow.",
    body: "Bring intake, scheduling, records, follow-up, and billing into one patient-aware line without asking the team to become data clerks.",
    flow: ["Inquiry", "Intake", "Visit", "Records", "Follow-up", "Billing"],
  },
  {
    id: "wealth",
    label: "Wealth",
    eyebrow: "Advisories · Family offices",
    headline: "A client experience with a memory.",
    body: "Connect onboarding, service requests, compliance trails, review preparation, and reporting so nothing important lives in one inbox.",
    flow: ["Prospect", "Onboard", "Plan", "Serve", "Review", "Report"],
  },
  {
    id: "retail",
    label: "Retail",
    eyebrow: "Stores · E-commerce",
    headline: "Know what happened before the customer asks.",
    body: "Reconcile demand, inventory, orders, fulfillment, exceptions, and service around the same customer promise.",
    flow: ["Demand", "Order", "Inventory", "Pick", "Deliver", "Support"],
  },
  {
    id: "legal",
    label: "Legal",
    eyebrow: "Firms · In-house teams",
    headline: "Keep the matter moving between the moments that matter.",
    body: "Connect intake, engagement, deadlines, documents, client updates, and closeout while preserving clear ownership and judgment.",
    flow: ["Intake", "Engage", "Plan", "Work", "Update", "Close"],
  },
] as const;

export type FrictionId = (typeof frictions)[number]["id"];
export type IndustryId = (typeof industries)[number]["id"];
export type ToolName = (typeof tools)[number];

export function scrollToId(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

export const offers = [
  {
    id: "mri",
    kicker: "Diagnostic",
    name: "Workday MRI",
    summary:
      "Days beside your team, not months. One map of where the day doubles back, ranked by what it costs the people and the customer.",
    outcomes: ["Observed handoffs, not assumed ones", "Friction ranked by drag", "A rebuild plan the team already agrees with"],
  },
  {
    id: "rebuild",
    kicker: "Engagement",
    name: "Operating line rebuild",
    summary:
      "We connect intake to invoice into one operating layer and take the retyping, chasing, and reconciling out of the day.",
    outcomes: ["Entered once, seen everywhere", "Clear ownership at every handoff", "Automation and AI only where they earn a place"],
  },
  {
    id: "run",
    kicker: "Ongoing",
    name: "Keep it owned",
    summary:
      "Your people run it. We stay close enough to keep it improving, and far enough that you never depend on us.",
    outcomes: ["Training in the style that fits the staff", "Exceptions surfaced early", "A line that keeps getting simpler"],
  },
] as const;

export const facts = [
  { value: "20+", label: "Years improving operations" },
  { value: "5", label: "Industries, one line of work" },
  { value: "Intake → Invoice", label: "The whole line, not a tool" },
  { value: "Richmond, VA", label: "Operators, on site" },
] as const;

export const beliefs = [
  "The goal is not more technology. It is less work between the work.",
  "Start with the person and the process. Shape the software around them.",
  "The people closest to the work already know where it bends.",
  "AI earns its place one handoff at a time.",
] as const;

export const contactEmail = "hello@fanworks.io";
