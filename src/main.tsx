import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./app/queryClient";
import { appTheme } from "./theme";
import { appRouter } from "./app/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);