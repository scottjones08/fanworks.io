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
    body: "We sit beside the people doing it and watch the handoffs a process map misses.",
  },
  {
    number: "02",
    verb: "Map",
    title: "Name the drag.",
    body: "We trace the work end to end and rank the friction by what it costs.",
  },
  {
    number: "03",
    verb: "Rebuild",
    title: "Connect what matters.",
    body: "We rebuild the operating layer under the day, with automation only where it earns a place.",
  },
  {
    number: "04",
    verb: "Hand off",
    title: "Leave it owned.",
    body: "Your people run it, understand it, and keep improving it without us.",
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
    moments: ["Quote-to-order", "Scheduling", "Inventory", "Job tickets", "Production visibility", "On-time delivery"],
    breaks: "Between the quote and the job ticket. The estimate lives in one person's spreadsheet, the order gets retyped into the system the shop happens to use, and the floor learns what was promised from a phone call. Scheduling is a whiteboard and a memory. Inventory is counted when something runs out.",
    connects: "Estimating, order entry, the job traveler, materials, the schedule, quality checks, and the dock, so the same job carries the same facts from the first call to the invoice.",
    employees: "The person at the desk stops re-entering. The floor gets the job with the drawing, the material, and the due date attached. Questions stop travelling upstream.",
    leadership: "One picture of what is quoted, what is booked, what is late, and why. On-time delivery becomes something you can see mid-week, not discover at month end.",
    first: "A week beside the office and the floor, following three live jobs from quote to dock. You get the map of where each one doubled back, ranked by what it cost, and a rebuild plan the team already agrees with.",
  },
  {
    id: "health",
    label: "Healthcare and dental",
    eyebrow: "Clinics · Practices · Multi-location groups",
    headline: "Let the visit lead. Let the systems follow.",
    body: "Bring intake, scheduling, records, follow-up, and billing into one patient-aware line without asking the team to become data clerks.",
    flow: ["Inquiry", "Intake", "Visit", "Records", "Follow-up", "Billing"],
    moments: ["Scheduling", "Patient flow", "Multi-location reporting", "Claims", "Provider capacity", "Data reconciliation"],
    breaks: "At the front desk and at month end. Scheduling, the practice system, the phone log, and the claims tool each hold part of the day. Each location reports differently, so someone rebuilds the numbers by hand and the leadership meeting argues about which version is right.",
    connects: "Inquiry, scheduling, intake, the visit, records, follow-up, claims, and reporting across locations, so a patient is one record and a location is one set of numbers.",
    employees: "Front desk stops chasing. Providers see the day they will actually have. Billing works from what happened, not from what was remembered.",
    leadership: "Consistent operational and executive reporting across every location, from the same definitions, on the same schedule. Capacity, no-shows, claims, and cash on one page.",
    first: "Two days at one location, one day at another, and a look at how the numbers are built today. You get the reconciled picture, where the definitions differ, and the first line worth fixing.",
  },
  {
    id: "wealth",
    label: "Wealth",
    eyebrow: "Advisories · Family offices",
    headline: "A client experience with a memory.",
    body: "Connect onboarding, service requests, compliance trails, review preparation, and reporting so nothing important lives in one inbox.",
    flow: ["Prospect", "Onboard", "Plan", "Serve", "Review", "Report"],
    moments: ["Onboarding", "Review preparation", "Document trails", "Portfolio visibility", "Compliance evidence", "Advisor capacity"],
    breaks: "Between the relationship and the record. The advisor knows the client; the systems do not. Review prep is a two-day scavenger hunt through email, the CRM, the custodian portal, and a shared drive. Compliance evidence is reconstructed after the fact.",
    connects: "Prospecting, onboarding, planning, service requests, the document trail, review preparation, compliance evidence, and reporting into one governed workspace with the advisor at the centre.",
    employees: "Advisors prepare a review in an hour, not a weekend. Operations staff stop being the search engine. New team members inherit the client history instead of starting from the inbox.",
    leadership: "Advisor capacity you can actually plan around. Compliance you can show, not describe. A view of the book that does not depend on who is in the office.",
    first: "A few days shadowing two advisors and the operations desk through a full review cycle. You get the map of where the client story falls apart and what to connect first.",
  },
  {
    id: "retail",
    label: "Retail and e-commerce",
    eyebrow: "Stores · Online · Fulfilment",
    headline: "Know what happened before the customer asks.",
    body: "Reconcile demand, inventory, orders, fulfillment, exceptions, and service around the same customer promise.",
    flow: ["Demand", "Order", "Inventory", "Pick", "Deliver", "Support"],
    moments: ["Demand", "Inventory", "Fulfilment", "Customer service", "Returns", "Margin visibility"],
    breaks: "Between the promise and the shelf. The storefront says available, the warehouse says otherwise, and customer service finds out from the customer. Returns are handled three different ways. Margin is a quarterly surprise.",
    connects: "Demand signals, inventory, orders, picking and shipping, exceptions, returns, and service into one customer promise the whole business can see.",
    employees: "Service agents answer with facts instead of apologies. The warehouse works from a queue it trusts. Nobody reconciles the same order twice.",
    leadership: "Sell-through, stock, fulfilment, and margin on the same page, by channel, while there is still time to act.",
    first: "Three days across the storefront, the warehouse, and the service desk, following real orders and real returns. You get the exception map and the first promise worth keeping every time.",
  },
  {
    id: "legal",
    label: "Legal",
    eyebrow: "Firms · In-house teams",
    headline: "Keep the matter moving between the moments that matter.",
    body: "Connect intake, engagement, deadlines, documents, client updates, and closeout while preserving clear ownership and judgment.",
    flow: ["Intake", "Engage", "Plan", "Work", "Update", "Close"],
    moments: ["Lead-to-client conversion", "Matter handoffs", "Deadlines", "Records requests", "Case value", "Marketing attribution"],
    breaks: "At intake and at every handoff after it. Leads arrive by phone, form, and referral and are logged three ways. The matter moves between people by email. Deadlines live in someone's head. Nobody can say which marketing brought the good cases.",
    connects: "Intake, engagement, matter movement, deadlines, records and documents, client updates, marketing attribution, and leadership reporting, with ownership attached at each step.",
    employees: "Intake staff work one queue. Paralegals see what is due and who holds it. Attorneys spend the day on judgment, not on finding the file.",
    leadership: "Conversion, matter load, deadlines at risk, case value, and which marketing actually pays, on one page, every week.",
    first: "A week with intake, two matter teams, and whoever owns marketing. You get the map from first call to close and the handoff that is costing the most.",
  },
  {
    id: "services",
    label: "Professional services",
    eyebrow: "Agencies · Engineering · Advisory",
    headline: "Sell it, scope it, deliver it, and bill it as one piece of work.",
    body: "Connect pipeline, scoping, delivery, utilization, billing, and the knowledge that makes the next project easier than the last.",
    flow: ["Pipeline", "Scope", "Staff", "Deliver", "Bill", "Learn"],
    moments: ["Pipeline", "Scoping", "Delivery", "Utilization", "Billing", "Institutional knowledge"],
    breaks: "Between the proposal and the project plan, and again between the timesheet and the invoice. Scope is agreed in a document nobody reopens. Utilization is a guess. What the team learned lives in the people who did the work.",
    connects: "Pipeline, scoping, staffing, delivery, time, billing, and a working record of how the firm actually does things.",
    employees: "Project leads start with the real scope and a real team. Consultants stop rebuilding what a colleague already built. Billing stops being a monthly argument.",
    leadership: "Pipeline to cash on one line: what is sold, what is staffed, what is at risk, and what the firm knows that it can sell again.",
    first: "A few days across sales, delivery, and finance, following two live projects. You get the scope-to-invoice map and the first thing to connect.",
  },
  {
    id: "finops",
    label: "Financial operations and payments",
    eyebrow: "Finance · Platform spend · Payments",
    headline: "One defensible view of where the money goes.",
    body: "Bring spend, forecasts, recurring costs, vendor control, reconciliation, and management reporting into one view leadership can stand behind.",
    flow: ["Commit", "Spend", "Reconcile", "Forecast", "Report", "Decide"],
    moments: ["Spend visibility", "Reconciliation", "Forecasting", "Vendor control", "Recurring costs", "Management reporting"],
    breaks: "At reconciliation and in the forecast. Platform spend is spread across cards, contracts, and invoices. Renewals surprise people. The forecast is rebuilt every month from a different starting point, and the board pack is assembled by hand.",
    connects: "Commitments, actual spend, recurring costs, vendor terms, reconciliation, the forecast, and the management report, so a number means the same thing everywhere it appears.",
    employees: "Finance stops chasing receipts and rebuilding spreadsheets. Budget owners see their own numbers without asking.",
    leadership: "A forecast you can defend, renewals you can see coming, and a monthly view that takes hours to produce instead of days.",
    first: "A close cycle spent with finance and two budget owners. You get the reconciliation map, the recurring cost picture, and the first control worth automating.",
  },
] as const;

export type FrictionId = (typeof frictions)[number]["id"];
export type IndustryId = (typeof industries)[number]["id"];
export type ToolName = (typeof tools)[number];

export const offers = [
  {
    id: "mri",
    kicker: "Diagnostic",
    name: "Workday MRI",
    summary:
      "Days beside your team. One map of where the day doubles back, ranked by what it costs.",
    outcomes: ["Observed handoffs, not assumed ones", "Friction ranked by drag", "A rebuild plan the team already agrees with"],
  },
  {
    id: "rebuild",
    kicker: "Engagement",
    name: "Operating line rebuild",
    summary:
      "Intake to invoice as one operating layer. The retyping and chasing come out of the day.",
    outcomes: ["Entered once, seen everywhere", "Clear ownership at every handoff", "Automation and AI only where they earn a place"],
  },
  {
    id: "run",
    kicker: "Ongoing",
    name: "Keep it owned",
    summary:
      "Your people run it. We stay close enough to help, far enough that you never depend on us.",
    outcomes: ["Training in the style that fits the staff", "Exceptions surfaced early", "A line that keeps getting simpler"],
  },
] as const;

export const contactEmail = "hello@fanworks.io";

/** Anonymized project stories. Evidence is stated only where it has been approved. */
export const work = [
  {
    id: "wealth-os",
    sector: "Wealth",
    title: "A wealth advisory operating system",
    deck: "Client records, planning, compliance evidence, portfolio intelligence, and advisor-facing AI in one governed workspace.",
    situation:
      "A growing advisory firm ran on excellent advisors and a dozen disconnected tools. Client history lived in inboxes and memory. Preparing for a review meant a day of searching. Compliance evidence was assembled after the fact, from whatever could be found.",
    found:
      "The friction was not any one system. It was the handoff between the relationship and the record. Every advisor had a private version of the client, and operations spent its week translating between them.",
    changed:
      "One client record with the plan, the service history, the documents, and the compliance trail attached. Review preparation became a workflow with an owner, not a scramble. An advisor-facing assistant was added only where it could draw on that governed record, and it drafts; it does not decide.",
    possible:
      "Advisors walk into a review with the whole story. Operations sees every open request. Compliance can show its evidence instead of describing it. A new hire inherits the client, not the inbox.",
    human: "Advisors got their weekends back before reviews. Operations stopped being the search engine.",
    management: "Advisor capacity and compliance posture became visible and plannable, from the same record.",
    evidence: "Measurement in progress. Adoption signal: the review-prep workflow is in daily use by every advisor.",
  },
  {
    id: "legal-platform",
    sector: "Legal",
    title: "A legal operations and growth platform",
    deck: "Intake, matter movement, marketing attribution, deadlines, documents, and leadership reporting for a growing firm.",
    situation:
      "Leads came in by phone, form, and referral and were logged three different ways. Matters moved between people by email. Deadlines lived in a paralegal's head. Leadership could not say which marketing brought the cases worth having.",
    found:
      "Intake was the system. Everything downstream inherited its gaps. The firm was paying for marketing it could not attribute and losing matters in handoffs nobody could see.",
    changed:
      "A single intake queue with ownership. Matter movement with a clear next holder at every step. Deadlines, records requests, and documents attached to the matter. Attribution carried from first contact to signed engagement, and a weekly leadership page built from the same data.",
    possible:
      "Intake staff work one list. Attorneys see what is due and who holds it. Leadership sees conversion, matter load, deadlines at risk, and which marketing pays.",
    human: "The person who used to hold every deadline in their head now holds a system that reminds everyone.",
    management: "Marketing spend and case value became one conversation instead of two.",
    evidence: "Measurement in progress. Qualitative outcome: the firm stopped losing leads between the call and the file.",
  },
  {
    id: "health-reporting",
    sector: "Healthcare",
    title: "A multi-location healthcare reporting engine",
    deck: "Fragmented practice data turned into consistent operational and executive reporting across locations and systems.",
    situation:
      "A multi-location group ran on several practice systems, a scheduling tool, and a claims platform that did not agree with each other. Each location reported its own way. The monthly leadership meeting spent its first half arguing about whose numbers were right.",
    found:
      "The definitions differed, not just the tools. A no-show meant three things in three places. The person rebuilding the pack by hand was the only one who understood the whole picture, and it took them most of a week.",
    changed:
      "One set of definitions, agreed with the people who run each location. A reporting layer that pulls from every system on a schedule and reconciles to a single view. Operational pages for the location leads and an executive page for the group, built from the same numbers.",
    possible:
      "A location lead sees capacity, no-shows, claims, and cash for their site every morning. The group sees the same across every site, with the differences explained rather than argued.",
    human: "The person who built the pack by hand now spends that week on the exceptions the pack surfaces.",
    management: "The leadership meeting starts from an agreed picture and spends its time on decisions.",
    evidence: "Measurement in progress. Operational proof: the monthly pack is produced from the reporting layer without manual rebuild.",
  },
  {
    id: "property-intake",
    sector: "Property claims",
    title: "A property-case intake and review platform",
    deck: "Messy submissions structured, records linked across systems, and a reviewable workflow where automation assists rather than silently decides.",
    situation:
      "Cases arrived as photos, PDFs, forms, and phone notes. Each was retyped into two systems. Reviewers could not tell what had already been checked. Automation had been tried once and quietly made decisions nobody could inspect.",
    found:
      "The intake was unstructured and the review was invisible. The real cost was rework: cases re-opened because a linked record had been missed, and reviewers repeating each other's work.",
    changed:
      "A structured intake that accepts the mess and organizes it. Records linked across systems at the moment of intake. A review queue where every automated suggestion is visible, attributable, and overridable by a person, and where the decision always belongs to the reviewer.",
    possible:
      "Reviewers open a case with its history and its links already in place. Automation proposes; people decide; the trail shows who did what.",
    human: "Reviewers stopped doing data entry and started doing review.",
    management: "Case status, backlog, and reviewer decisions became inspectable at any moment.",
    evidence: "Measurement in progress. Operational proof: every automated suggestion carries a visible reason and a human decision.",
  },
  {
    id: "company-memory",
    sector: "Company intelligence",
    title: "A portable, client-owned company intelligence system",
    deck: "A knowledge environment that organizes institutional memory, supports private AI, and moves with the client instead of trapping them.",
    situation:
      "Decades of how the company actually works lived in a few long-tenured people, a shared drive, and a chat history. Leadership wanted to use AI on it and was rightly nervous about handing the company's memory to a vendor.",
    found:
      "The knowledge existed; it was unfindable and unowned. The risk was not the technology. It was building something the client could not leave.",
    changed:
      "A structured, client-owned knowledge environment on infrastructure the client controls. Institutional memory captured with its context and its owners. Private AI that answers from that environment and cites where it looked. Everything exportable, documented, and runnable without fanworks.",
    possible:
      "A new manager asks how something is done and gets the answer with the source. The company can change vendors, models, or consultants without losing its memory.",
    human: "The long-tenured people stopped being the only place the answers lived.",
    management: "The company's operating knowledge became an asset it owns rather than a dependency it rents.",
    evidence: "Measurement in progress. Ownership proof: the environment and its data sit in the client's own accounts and were handed over with documentation.",
  },
  {
    id: "compliance-os",
    sector: "Compliance",
    title: "A compliance operating system",
    deck: "Policies, evidence, ownership, approvals, and recurring controls turned into an inspectable working system instead of a folder of documents.",
    situation:
      "Compliance was a folder of policies and a calendar of scrambles. Evidence was gathered in the weeks before an audit. Controls had owners in name and nobody in practice.",
    found:
      "The policies were fine. The work was invisible. Nothing connected a control to the person who ran it, the evidence it produced, and the approval that closed it.",
    changed:
      "Each control became a recurring piece of work with an owner, a due date, an evidence requirement, and an approval. Evidence is captured as the work happens. The policy links to the controls that enforce it, and the whole thing can be inspected at any time.",
    possible:
      "An auditor's question becomes a filter, not a project. Leadership sees which controls are current, which are late, and who holds them.",
    human: "Control owners know what is theirs and when. The pre-audit scramble ended.",
    management: "Compliance posture became something to look at, not something to assemble.",
    evidence: "Measurement in progress. Operational proof: evidence is captured at the moment of the control rather than reconstructed before audits.",
  },
  {
    id: "finops-center",
    sector: "Financial operations",
    title: "A financial operations command center",
    deck: "Platform spend, forecasts, recurring costs, and operating decisions in one defensible view.",
    situation:
      "Spend was spread across cards, contracts, and invoices. Renewals surprised people. The forecast was rebuilt monthly from a different starting point, and the board pack took days to assemble.",
    found:
      "The numbers disagreed because they were assembled by different people from different sources with different definitions. Nobody owned the recurring cost picture.",
    changed:
      "Commitments, actual spend, recurring costs, and vendor terms brought into one reconciled view. A forecast that starts from last month's actuals instead of a blank sheet. A management report produced from the same data, on a schedule, with owners for every line.",
    possible:
      "Renewals are visible a quarter out. Budget owners see their own numbers. The forecast can be defended line by line.",
    human: "Finance stopped chasing and rebuilding. Budget owners stopped asking.",
    management: "Operating decisions are made from one view that everyone in the room trusts.",
    evidence: "Measurement in progress. Qualitative outcome: the monthly report is produced from the system rather than assembled by hand.",
  },
] as const;

export const experience = {
  title: "The experience behind the work.",
  lede:
    "Our experience spans founder-led businesses, complex enterprises, regulated industries, operating floors, professional practices, and technology teams. We have owned the numbers, managed the handoffs, introduced new systems, and dealt with what happens after the consultants leave.",
  themes: [
    "Building and operating founder-led companies",
    "Leading teams inside large, complex enterprises",
    "Running production and operational environments",
    "Designing systems for regulated businesses",
    "Owning budgets, forecasts, delivery, and performance",
    "Implementing technology that frontline teams actually use",
    "Translating between operators, executives, engineers, and customers",
    "Living with the systems after launch, not handing over a deck",
  ],
} as const;

export const fieldNotes = [
  {
    id: "dangerous-spreadsheet",
    title: "Why your best employee is also your most dangerous spreadsheet",
    deck: "The person who holds it all together is holding a system nobody else can see.",
    body: [
      "Every business has one. They know which customer needs a call before the invoice goes out, which supplier's dates are fiction, and which column in the sheet is the real one. The business runs on them, and it looks like it runs on the software.",
      "That is not a people problem. It is a system living in the wrong place. When it lives in a person it cannot be inspected, shared, or improved by anyone else, and it leaves when they do.",
      "The fix is not to replace them. It is to move what they know into the line of work, with their name still on it, so the business owns what they built.",
    ],
  },
  {
    id: "handoff-is-the-system",
    title: "The handoff is usually the system",
    deck: "Most operational drag lives between the tools, not inside them.",
    body: [
      "Ask a team where the day goes wrong and they point at software. Watch the day and it goes wrong at the moment work passes from one person to the next: the retyping, the clarifying email, the question that travels back upstream.",
      "Systems are bought one department at a time. Handoffs belong to nobody, so they are designed by nobody.",
      "Design the handoff and most of the tooling questions answer themselves.",
    ],
  },
  {
    id: "ai-ready",
    title: "What \"AI-ready\" actually means for an established business",
    deck: "It is not a model choice. It is whether the work is legible enough for anything to help.",
    body: [
      "AI is very good at working from clear records and very bad at working from a shared drive, three inboxes, and a memory. Most established businesses have the second thing.",
      "AI-ready means the work is written down where it happens, with owners, and the definitions agree. That is unglamorous, and it is the whole game.",
      "Get there and the AI decisions become small. Skip it and every AI project becomes a data-cleaning project with a deadline.",
    ],
  },
  {
    id: "automation-accountability",
    title: "Automation should create accountability, not hide it",
    deck: "If nobody can say why the system did what it did, it is not working. It is guessing on your behalf.",
    body: [
      "The failure mode of automation is not that it breaks. It is that it works quietly and nobody can tell you what it decided or why.",
      "Good automation leaves a trail: what it saw, what it proposed, who agreed. The decision that matters still has a name on it.",
      "That is slower to build and much cheaper to live with.",
    ],
  },
  {
    id: "dashboards-fail",
    title: "Why dashboards fail when ownership is unclear",
    deck: "A number nobody owns is a number nobody moves.",
    body: [
      "Dashboards get built, admired, and ignored. Not because the charts are wrong, but because nothing on them belongs to anyone.",
      "A metric is only useful once someone is responsible for what it measures and can change the work behind it.",
      "Start with the owners. The dashboard is the easy part.",
    ],
  },
  {
    id: "modernize-without-losing",
    title: "How to modernize without losing the knowledge in the room",
    deck: "The old way is not just habit. It is where the judgment lives.",
    body: [
      "Replacement projects fail the same way: the new system arrives, the workarounds vanish, and so does everything the workarounds were quietly handling.",
      "Sit with the people who run the old way first. Write down what the workaround protects. Build that into the new line before switching anything off.",
      "Modernizing is a transfer of knowledge, not a swap of software.",
    ],
  },
  {
    id: "installing-vs-changing",
    title: "The difference between installing software and changing how work moves",
    deck: "Software is the easy purchase. The operating change is the work.",
    body: [
      "You can install a system in a week. Changing who does what, in what order, with what information, takes sitting beside the people it affects.",
      "Most disappointing implementations were installations. The work still moved the old way, now with extra logins.",
      "Decide how the work should move first. Then choose what to install.",
    ],
  },
  {
    id: "measure-first",
    title: "What to measure before promising transformation",
    deck: "If you cannot describe today, you cannot prove tomorrow.",
    body: [
      "Before any rebuild, measure the drag as it stands: how long a handoff waits, how many times a fact is re-entered, how often a customer asks before you know.",
      "Those numbers are boring and they are the only honest baseline you will ever have.",
      "Promise improvement against them or do not promise at all.",
    ],
  },
  {
    id: "regulated-evidence",
    title: "Why regulated businesses need evidence, not confident answers",
    deck: "In a regulated room, the trail matters more than the conclusion.",
    body: [
      "A confident answer with no trail is a liability. Regulated businesses know this and are right to distrust systems that cannot show their work.",
      "Build the evidence into the work as it happens: who did what, from which record, with which approval.",
      "Then the confident answer is free, because it comes with the proof attached.",
    ],
  },
  {
    id: "company-memory-owned",
    title: "How to build company memory the client still owns",
    deck: "Institutional knowledge should not become a subscription.",
    body: [
      "The easy way to organize a company's knowledge is to put it in someone else's platform. The easy way is a trap.",
      "Build the memory on infrastructure the company controls, in formats it can export, with documentation its own people can follow.",
      "The consultant should be able to leave. The memory should not.",
    ],
  },
] as const;

export const trust = {
  title: "Your operating knowledge stays yours.",
  body: [
    "We design systems that are understandable, inspectable, and portable. Your people can read them, question them, and run them without us.",
    "We retain only what is needed to support the work, and we do not turn client knowledge into a permanent dependency on fanworks. When we leave, the system, the documentation, and the memory stay with you.",
    "We do not publish client names, and we do not publish a number until it has been measured and approved.",
  ],
} as const;

/** The people we design for first. The systems follow them. */
export const people = [
  {
    role: "The front desk",
    carries: "Knows which customer needs a call before the invoice goes out. Keeps it in a notebook.",
  },
  {
    role: "The shop floor lead",
    carries: "Learns what the office promised from a phone call. Makes it true with a whiteboard.",
  },
  {
    role: "The advisor",
    carries: "Holds the client relationship in their head. The record holds part of it.",
  },
  {
    role: "The paralegal",
    carries: "Carries every deadline for the firm. Finds the file by knowing who touched it last.",
  },
  {
    role: "The practice manager",
    carries: "Rebuilds the monthly numbers by hand from three systems that disagree.",
  },
  {
    role: "The controller",
    carries: "Chases receipts and assembles the board pack the night before.",
  },
] as const;
