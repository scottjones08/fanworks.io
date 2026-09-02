import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./shared/base.css";

const Site = lazy(() => import("./site/Site"));
// The previous design stays reachable for comparison during review only.
const Legacy = lazy(() => import("./App"));

const path = window.location.pathname.replace(/\/+$/, "") || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={null}>{path === "/current" ? <Legacy /> : <Site />}</Suspense>
  </React.StrictMode>,
);
