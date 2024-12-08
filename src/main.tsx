import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.scss";
import App from "@/App.tsx";
import SuperTokensWebJs from "supertokens-web-js";
import { frontendConfig } from "@/config/frontendConfig";

SuperTokensWebJs.init(frontendConfig());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
