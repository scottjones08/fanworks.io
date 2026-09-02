import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./shared/base.css";

// Each direction is its own chunk so its CSS and fonts load only when viewed.
const Current = lazy(() => import("./App"));
const Chooser = lazy(() => import("./concepts/Chooser"));
const Line = lazy(() => import("./concepts/line/Line"));
const Signal = lazy(() => import("./concepts/signal/Signal"));
const Studio = lazy(() => import("./concepts/studio/Studio"));
const Blueprint = lazy(() => import("./concepts/blueprint/Blueprint"));
const Counter = lazy(() => import("./concepts/counter/Counter"));
const Grid = lazy(() => import("./concepts/grid/Grid"));

function route() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/line") return <Line />;
  if (path === "/signal") return <Signal />;
  if (path === "/studio") return <Studio />;
  if (path === "/blueprint") return <Blueprint />;
  if (path === "/counter") return <Counter />;
  if (path === "/grid") return <Grid />;
  if (path === "/current") return <Current />;
  return <Chooser />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={null}>{route()}</Suspense>
  </React.StrictMode>,
);
