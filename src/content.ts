import {
  Cable,
  Compass,
  EyeOff,
  Shuffle,
  Workflow,
} from "lucide-react";

export const navItems = [
  { id: "work", label: "Work" },
  { id: "ethos", label: "Approach" },
  { id: "story", label: "Story" },
] as const;

export const services = [
  {
    number: "01",
    name: "Disconnected systems",
    line: "Your tools do not talk to each other.",
    icon: Cable,
  },
  {
    number: "02",
    name: "Manual work",
    line: "People spend too much time copying, chasing, and checking.",
    icon: Workflow,
  },
  {
    number: "03",
    name: "Unclear ownership",
    line: "Good work gets stuck between people and teams.",
    icon: Compass,
  },
  {
    number: "04",
    name: "Inconsistent processes",
    line: "The same job gets done five different ways.",
    icon: Shuffle,
  },
  {
    number: "05",
    name: "Lack of visibility",
    line: "You find out too late what is slowing things down.",
    icon: EyeOff,
  },
];

export const principles = [
  ["See the real work", "Sit with the team and watch how the day actually runs."],
  ["Fix what matters", "Start with the problem creating the most drag."],
  ["Leave it simpler", "Build a better way your team can understand and own."],
] as const;

export const rooms = [
  {
    number: "01",
    name: "Listen",
    title: "See the work as it is.",
    body: "We sit with your team, listen, and watch where the day gets harder than it should.",
    fixes: "Lack of visibility",
  },
  {
    number: "02",
    name: "Assess",
    title: "Find what is getting stuck.",
    body: "Together, we map the handoffs, delays, and decisions that slow people down.",
    fixes: "Unclear ownership · Inconsistent processes",
  },
  {
    number: "03",
    name: "Integrate",
    title: "Bring the pieces together.",
    body: "We connect the tools and information your team already uses, so everyone can work from the same picture.",
    fixes: "Disconnected systems",
  },
  {
    number: "04",
    name: "Automate",
    title: "Make every interaction easier.",
    body: "Routine work runs quietly in the background, so your team can give every customer their full attention.",
    fixes: "Manual work",
  },
];

export function scrollToId(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}
