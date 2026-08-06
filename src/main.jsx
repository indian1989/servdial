import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      <BrowserRouter basename="/">

        <App />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />

      </BrowserRouter>

    </HelmetProvider>

  </React.StrictMode>

);