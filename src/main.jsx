import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { populatedb } from "./mocks/data/populate.js";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    const { worker } = await import("./mocks/browser");
    worker.start();
  }
}
if (import.meta.env.VITE_USE_MOCKS === "true") {
  populatedb();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(<App />);
});
