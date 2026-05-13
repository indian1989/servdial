import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

/* ================= CANONICAL DOMAIN REDIRECT ================= */
if (window.location.hostname === "servdial.onrender.com") {
  window.location.replace(
    `https://servdial.com${window.location.pathname}${window.location.search}${window.location.hash}`
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);