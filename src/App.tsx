import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Mic,
  MicOff,
  Radio,
  Sparkles,
} from "lucide-react";

type RealtimeStatus = "idle" | "connecting" | "connected" | "listening" | "error";

const STORY_BEATS = [
  {
    marker: "01",
    title: "Begin with the lived day",
    body: "We sit with the calls, handoffs, notes, pauses, side conversations, and small recoveries that keep a team moving. The operating system is already there; it just needs to be seen clearly.",
  },
  {
    marker: "02",
    title: "Translate friction into shape",
    body: "The work becomes a map of where people lose context, repeat themselves, or bend around software. From there, we can decide what deserves automation and what deserves more human attention.",
  },
  {
    marker: "03",
    title: "Build technology that remembers",
    body: "Realtime voice, AI workflows, and product interfaces become useful when they respect the way people actually speak, decide, forget, repair, and trust.",
  },
];

const ENGAGE_OPTIONS = ["Discovery sprint", "Realtime prototype", "Operating model", "Something unfolding"];

function statusCopy(status: RealtimeStatus): string {
  switch (status) {
    case "connecting":
      return "Opening the room";
    case "connected":
    case "listening":
      return "Listening";
    case "error":
      return "Voice paused";
    default:
      return "Begin with voice";
  }
}

function isActive(status: RealtimeStatus): boolean {
  return status === "connecting" || status === "connected" || status === "listening";
}

function extractClientSecret(payload: { value?: string; client_secret?: { value?: string } }): string | null {
  return payload.value || payload.client_secret?.value || null;
}

function normalizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || "");
  if (/permission denied|notallowed/i.test(message)) {
    return "Microphone access was denied. Allow microphone access and try again.";
  }
  return message || "Voice is not available right now. Try again in a moment.";
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default function App() {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [visitorText, setVisitorText] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const active = isActive(status);
  const statusLabel = useMemo(() => statusCopy(status), [status]);

  const stopRealtime = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current.remove();
      audioRef.current = null;
    }
    setStatus("idle");
  }, []);

  const handleRealtimeEvent = useCallback((raw: string) => {
    const event = safeJsonParse(raw);
    if (!event || typeof event.type !== "string") return;
    if (event.type === "conversation.item.input_audio_transcription.completed" && typeof event.transcript === "string") {
      setVisitorText(event.transcript);
    }
    if (
      (event.type === "response.output_text.delta" || event.type === "response.audio_transcript.delta") &&
      typeof event.delta === "string"
    ) {
      setAssistantText((current) => `${current}${event.delta}`);
    }
  }, []);

  const startRealtime = useCallback(async () => {
    if (active) {
      stopRealtime();
      return;
    }

    setStatus("connecting");
    setError("");
    setVisitorText("");
    setAssistantText("");

    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
        throw new Error("This browser does not support realtime microphone sessions.");
      }

      const sessionResponse = await fetch("/api/realtime-session", { method: "POST" });
      const sessionPayload = await sessionResponse.json().catch(() => ({}));
      if (!sessionResponse.ok) {
        throw new Error(sessionPayload.error || "Voice is not available right now.");
      }
      const ephemeralKey = extractClientSecret(sessionPayload);
      if (!ephemeralKey) throw new Error("Voice session could not start right now.");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const pc = new RTCPeerConnection();
      peerRef.current = pc;
      const remoteAudio = document.createElement("audio");
      audioRef.current = remoteAudio;
      remoteAudio.autoplay = true;
      remoteAudio.setAttribute("aria-hidden", "true");
      pc.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
      };
      const [audioTrack] = stream.getAudioTracks();
      if (!audioTrack) throw new Error("No microphone track was available.");
      pc.addTrack(audioTrack, stream);

      const dc = pc.createDataChannel("oai-events");
      dc.addEventListener("open", () => {
        setStatus("listening");
        dc.send(
          JSON.stringify({
            type: "response.create",
            response: {
              instructions:
                "Greet the visitor warmly in one short sentence, then ask how their day has been and what part of being human at work they want technology to understand better.",
            },
          }),
        );
      });
      dc.addEventListener("message", (event) => handleRealtimeEvent(String(event.data)));
      dc.addEventListener("close", () => setStatus("idle"));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });
      if (!sdpResponse.ok) throw new Error("Voice connection could not start right now.");
      await pc.setRemoteDescription({ type: "answer", sdp: await sdpResponse.text() });
      setStatus("connected");
    } catch (caught) {
      stopRealtime();
      setStatus("error");
      setError(normalizeError(caught));
    }
  }, [active, handleRealtimeEvent, stopRealtime]);

  const submitEngage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => stopRealtime, [stopRealtime]);

  return (
    <main className="site-shell">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-bg hero-bg-sharp" aria-hidden="true" />
        <div className="hero-bg hero-bg-soft" aria-hidden="true" />
        <div className="hero-noise" aria-hidden="true" />

        <div className="hero-frame">
          <header className="top-nav">
            <a href="#top" className="wordmark">
              FanWorks
            </a>
            <nav className="nav-links" aria-label="Primary navigation">
              <a href="#story">Expertise</a>
              <a href="#voice">Voice</a>
              <a href="#engage">Engage</a>
            </nav>
          </header>

          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 id="hero-title">Be More Human</h1>
            <p>Human centered consulting for teams building AI, voice, and workflow systems that should feel less like machinery and more like memory.</p>
          </motion.div>

          <div className="hero-footer">
            <p>EST. 2025</p>
            <a href="#story" className="initiate-link" aria-label="Continue into the FanWorks story">
              <span />
              Initiate
            </a>
          </div>
        </div>
      </section>

      <section className="story-section" id="story" aria-labelledby="story-title">
        <div className="section-frame story-intro">
          <p className="section-label">The story</p>
          <h2 id="story-title">The future of work is not less human. It is more carefully designed around the human parts that already carry the work.</h2>
          <p>
            FanWorks helps founders, operators, and product teams slow down long enough to notice the real system:
            the spoken context, half-remembered constraints, emotional labor, and judgment calls that never make it
            into a requirements doc. Then we build from there.
          </p>
        </div>

        <div className="section-frame story-beats">
          {STORY_BEATS.map((beat) => (
            <article key={beat.title} className="story-card">
              <p>{beat.marker}</p>
              <h3>{beat.title}</h3>
              <span>{beat.body}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="voice-section" id="voice" aria-labelledby="voice-title">
        <div className="section-frame voice-grid">
          <div className="voice-copy">
            <p className="section-label">GPT-Realtime</p>
            <h2 id="voice-title">Start with a conversation before you start with a screen.</h2>
            <p>
              Press the room open and the Realtime host begins where most consulting skips ahead: your day, your
              language, the workarounds you built, and the moments where software should move quietly.
            </p>
          </div>

          <div className="voice-panel">
            <div className="mic-wrap">
              <span className={active ? "pulse-ring is-active" : "pulse-ring"} aria-hidden="true" />
              <button
                type="button"
                onClick={startRealtime}
                aria-label={active ? "Stop FanWorks Realtime voice" : "Start FanWorks Realtime voice"}
                aria-pressed={active}
                className={status === "error" ? "main-mic is-error" : "main-mic"}
              >
                {status === "connecting" ? (
                  <Loader2 className="spin" aria-hidden="true" size={58} />
                ) : active ? (
                  <MicOff aria-hidden="true" size={58} />
                ) : (
                  <Mic aria-hidden="true" size={58} />
                )}
              </button>
            </div>

            <div className="transcript">
              <p className="status-line">
                <Radio aria-hidden="true" size={14} />
                {statusLabel}
              </p>
              {error ? (
                <p className="error-copy">{error}</p>
              ) : (
                <>
                  <p className="transcript-label">Host</p>
                  <p className="host-copy">
                    {assistantText.trim() || "How has your day been, and what should technology understand about it?"}
                  </p>
                  <p className="transcript-label">You</p>
                  <p className="visitor-copy">
                    {visitorText.trim() || "Your words will appear here once the room is listening."}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="section-frame engage-grid">
          <div className="engage-copy">
            <p className="section-label">Engage</p>
            <h2 id="engage-title">Bring a messy workflow, a voice idea, or a product that needs to remember the person using it.</h2>
            <p>
              The first step is a small, honest conversation. Tell us where the work feels least human, what you are
              trying to protect, and what should change without creating another layer of noise.
            </p>
            <div className="engage-proof">
              <div>
                <Sparkles aria-hidden="true" size={18} />
                AI strategy rooted in operational reality
              </div>
              <div>
                <CheckCircle2 aria-hidden="true" size={18} />
                Realtime prototypes that make the story testable
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitEngage}>
            <div className="form-row">
              <label>
                Name
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>
            <label>
              Organization
              <input name="organization" autoComplete="organization" />
            </label>
            <label>
              What are we exploring?
              <select name="engagement" defaultValue={ENGAGE_OPTIONS[0]}>
                {ENGAGE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Where does the work feel least human?
              <textarea name="story" rows={5} required />
            </label>
            <button type="submit" className="submit-button">
              Send the signal
              <ArrowRight aria-hidden="true" size={18} />
            </button>
            {submitted ? (
              <p className="success-message" role="status">
                <Mail aria-hidden="true" size={16} />
                Thank you. The signal is captured locally for this prototype.
              </p>
            ) : (
              <p className="form-note">Prefer email? hello@fan.works</p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
