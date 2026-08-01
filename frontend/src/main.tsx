import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { OverlayProvider } from "./contexts/OverlayContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <OverlayProvider>
        <App />
      </OverlayProvider>
    </AuthProvider>
  </StrictMode>,
);
