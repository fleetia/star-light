import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeRoot } from "@fleetia/lagrange";
import "./reset.css";
import "@fleetia/lagrange/styles.css";
import "./index.css";
import { App } from "./App";
import { kboTheme } from "./styles/lagrange.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeRoot themeClassName={kboTheme}>
      <App />
    </ThemeRoot>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  const hadControllerAtLoad = !!navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadControllerAtLoad) return;
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then(registration => registration.update());
  });
}
