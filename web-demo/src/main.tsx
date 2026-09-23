import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { addCollection } from "@iconify/react";
import { initMockBackend } from "@/mock/backend";
import App from "./App";
import mdiSubset from "@/assets/mdi-subset.json";

import "./styles/global.css";
import "./styles/phone.css";
import "./styles/app.css";

// Subconjunto de Material Design Icons usado por la app (empaquetado, offline)
addCollection(mdiSubset);

// Backend simulado de Firebase (seed + simulador del sistema IoT)
initMockBackend();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
