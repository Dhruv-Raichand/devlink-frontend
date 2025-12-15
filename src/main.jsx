import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SilkProvider } from "./context/SilkContext.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SilkProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </SilkProvider>
  </StrictMode>
);
