import React from "react";
import ReactDOM from "react-dom/client";
import "./shared/base.css";
import Site from "./site/Site";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Site />
  </React.StrictMode>,
);
