import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/outfit";
import "@fontsource-variable/geist";
import "./index.css";
import App from "./App";

// Component previews, opened with ?demo=<name>. They never load on the normal site.
const demos: Record<string, ReturnType<typeof lazy>> = {
  parallax: lazy(() => import("./demos/default")),
};
const Demo = demos[new URLSearchParams(window.location.search).get("demo") ?? ""];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {Demo ? (
      <Suspense fallback={null}>
        <Demo />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
