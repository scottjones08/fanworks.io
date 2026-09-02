import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./shared/base.css";

// Each direction is its own chunk so its CSS and fonts load only when viewed.
const Current = lazy(() => import("./App"));
const Chooser = lazy(() => import("./concepts/Chooser"));
const Line = lazy(() => import("./concepts/line/Line"));
const Signal = lazy(() => import("./concepts/signal/Signal"));
const Studio = lazy(() => import("./concepts/studio/Studio"));

function route() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/line") return <Line />;
  if (path === "/signal") return <Signal />;
  if (path === "/studio") return <Studio />;
  if (path === "/current") return <Current />;
  return <Chooser />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={null}>{route()}</Suspense>
  </React.StrictMode>,
);
