import { type FormEvent, useEffect, useRef, useState } from "react";

export type FormState = "idle" | "sending" | "sent" | "error";

type Options = {
  brief?: string;
  briefVersion?: number;
  idleStatus?: string;
  briefStatus?: string;
  /** Text sent ahead of the typed message, e.g. the sentence with blanks. */
  prefix?: string;
};

/** Shared state machine for the /api/contact form, used by every concept. */
export function useContactForm({
  brief = "",
  briefVersion = 0,
  idleStatus = "A few honest lines are enough.",
  briefStatus = "Your map was added as a draft. Edit anything you like.",
  prefix = "",
}: Options = {}) {
  const [state, setState] = useState<FormState>("idle");
  const [status, setStatus] = useState(idleStatus);
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (briefVersion > 0) {
      setMessage(brief);
      setStatus(briefStatus);
      setState("idle");
      messageRef.current?.focus({ preventScroll: true });
    }
  }, [brief, briefVersion, briefStatus]);

  const busy = state === "sending" || state === "sent";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setStatus("Sending…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          message: prefix ? `${prefix}\n\n${message}`.trim() : message,
          company: String(data.get("company") || ""),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not send that just now.");
      setState("sent");
      setStatus("Received. We'll read it and reply.");
      setMessage("");
      form.reset();
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "Could not send that just now. Email hello@fanworks.io.");
    }
  };

  return { state, status, message, setMessage, messageRef, busy, submit };
}
