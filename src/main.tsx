import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "@/router/route";
import "@/styles/index.scss";
import SuperTokensWebJs from "supertokens-web-js";
import { frontendConfig } from "@/config/frontendConfig";

SuperTokensWebJs.init(frontendConfig());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
