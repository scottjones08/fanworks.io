import React from "react";
import { createRoot } from "react-dom/client";
import Workspace from "./workspace";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<React.StrictMode><Workspace /></React.StrictMode>);
