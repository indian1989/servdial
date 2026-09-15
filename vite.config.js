// frontend/vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
  ],

  base: "/",

    build: {
    outDir: isSsrBuild ? "dist-ssr" : "dist",

    emptyOutDir: true,

   rollupOptions: {
  input: {
    client: "index.html",
  },
},
  },

  ssr: {
  noExternal: [
    "react",
    "react-dom",
    "react-router-dom",
    "react-router",
    "react-helmet-async",
  ],
},
}));