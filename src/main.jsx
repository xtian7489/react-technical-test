import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { populatedb } from "./mocks/data/populate.js";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser.js");

  return worker.start();
}
if (import.meta.env.MODE === "development") {
  populatedb();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(<App />);
});
