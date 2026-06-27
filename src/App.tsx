import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mic, MicOff, Radio, Sparkles } from "lucide-react";

type RealtimeStatus = "idle" | "connecting" | "connected" | "listening" | "error";

const PRINCIPLES = [
  {
    kicker: "01",
    title: "Start with the day",
    body: "The workday is the artifact. Calls, handoffs, pauses, worries, shortcuts, and rituals come before systems.",
  },
  {
    kicker: "02",
    title: "Name the friction",
    body: "Most teams do not need another screen first. They need the real process made visible, spoken plainly, and respected.",
  },
  {
    kicker: "03",
    title: "Shape the stack",
    body: "GPT-Realtime becomes useful when it follows the human path instead of forcing people to rebuild themselves around software.",
  },
];

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
      return "Start the journey";
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
        dc.send(JSON.stringify({
          type: "response.create",
          response: {
            instructions:
              "Greet the visitor warmly in one short sentence, then ask how their day has been and what part of being human at work they want technology to understand better.",
          },
        }));
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

  useEffect(() => stopRealtime, [stopRealtime]);

  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="page-frame">
          <nav className="top-nav">
            <a href="/" className="wordmark">Fan Works</a>
            <div className="realtime-label">
              <Radio aria-hidden="true" size={14} />
              GPT-Realtime
            </div>
          </nav>

          <div className="hero-grid">
            <div className="hero-copy">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="hero-intro"
              >
                <div className="tag-row">
                  <span className="tag">Human-centered consulting</span>
                  <span className="drop"><Sparkles aria-hidden="true" size={14} /> Drop 01</span>
                </div>
                <h1>Bring the human back.</h1>
                <p className="lede">
                  Technology promised easier work. Then it gave us more tabs, more steps, more passwords, more
                  forgetting. Fan Works starts with your process, your day, and the parts of being human worth
                  protecting.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="principles"
              >
                {PRINCIPLES.map((principle) => (
                  <article key={principle.title}>
                    <p className="kicker">{principle.kicker}</p>
                    <h2>{principle.title}</h2>
                    <p>{principle.body}</p>
                  </article>
                ))}
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="hero-image-card"
            >
              <img src="/fan-works-hero.png" alt="Matte microphone beside a clean sneaker sole on concrete" />
              <div className="image-control">
                <div>
                  <p className="kicker">Voice room</p>
                  <p>{statusLabel}</p>
                </div>
                <button type="button" className="small-mic" onClick={startRealtime}>
                  {active ? <MicOff aria-hidden="true" size={16} /> : <Mic aria-hidden="true" size={16} />}
                  {active ? "Stop" : "Open"}
                </button>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="voice-section">
        <div className="voice-grid">
          <div>
            <p className="kicker wide">The first conversation</p>
            <h2>Your workflow has a pulse.</h2>
            <p>
              Press the mic and the Realtime host begins where most consulting skips ahead: your day, your language,
              the workarounds you built, and the moments where software should move quietly.
            </p>
          </div>

          <div className="voice-control-grid">
            <div className="mic-wrap">
              <span className={active ? "pulse-ring is-active" : "pulse-ring"} aria-hidden="true" />
              <button
                type="button"
                onClick={startRealtime}
                aria-label={active ? "Stop Fan Works Realtime voice" : "Start Fan Works Realtime voice"}
                aria-pressed={active}
                className={status === "error" ? "main-mic is-error" : "main-mic"}
              >
                {status === "connecting" ? (
                  <Loader2 className="spin" aria-hidden="true" size={80} />
                ) : active ? (
                  <MicOff aria-hidden="true" size={80} />
                ) : (
                  <Mic aria-hidden="true" size={80} />
                )}
              </button>
            </div>

            <div className="transcript">
              <p className="kicker wide">{statusLabel}</p>
              {error ? (
                <p className="error-copy">{error}</p>
              ) : (
                <>
                  <p className="kicker">Host</p>
                  <p className="host-copy">
                    {assistantText.trim() || "How has your day been, and what should technology understand about it?"}
                  </p>
                  <p className="kicker">You</p>
                  <p className="visitor-copy">
                    {visitorText.trim() || "Your words will appear here once the room is listening."}
                  </p>
                </>
              )}
              <a href="mailto:hello@fan.works?subject=Start%20the%20journey" className="mail-link">
                Start without voice <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

