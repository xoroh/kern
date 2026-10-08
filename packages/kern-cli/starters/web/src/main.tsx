import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./app.css";

const root = document.getElementById("root");
if (!root) throw new Error("kern starter: missing #root element");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
