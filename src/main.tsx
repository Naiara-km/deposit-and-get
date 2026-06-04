import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { App } from "@/App";
import { PromoProvider } from "@/context/PromoContext";
import "@/styles/globals.css";

// HashRouter in production so the prototype works on any static host
// (incl. GitHub Pages) without server-side rewrites. Dev keeps clean URLs
// via BrowserRouter for the inner-loop tooling.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <PromoProvider>
        <App />
      </PromoProvider>
    </Router>
  </React.StrictMode>
);
