import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import App from "./App";

import "./index.css";

// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ColorModeScript initialColorMode="dark" />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
