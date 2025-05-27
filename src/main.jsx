import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { populatedb } from "./mocks/data/populate.js";

async function enableMocking() {
  console.log();

  if (import.meta.env !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser.js");

  return worker.start();
}
if (import.meta.env === "development") {
  populatedb();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
