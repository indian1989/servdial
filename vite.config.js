
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),

    // PWA plugin only for client build, not SSR build
    ...(
      isSsrBuild
        ? []
        : [
            VitePWA({
              registerType: "autoUpdate",

              manifest: {
                name: "ServDial - Trusted Local Businesses & Services",
                short_name: "ServDial",
                description:
                  "Discover trusted local businesses and services across India.",

                start_url: "/",
                scope: "/",
                display: "standalone",

                background_color: "#ffffff",
                theme_color: "#2563eb",

                icons: [
                  {
                    src: "/pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                  },
                  {
                    src: "/pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                  },
                ],
              },

              workbox: {
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,

  globPatterns: [
    "**/*.{js,css,html,ico,png,svg,webp,woff2}",
  ],

  
runtimeCaching: [
  {
    // Only verified public API GET endpoints
    urlPattern:
      /^https?:\/\/(?:api\.servdial\.com|localhost:5000)\/api\/(?:homepage|categories(?:\/(?:trending|[^/?]+(?:\/children)?))?|cities(?:\/(?:trending|states|[^/?]+(?:\/areas)?))?)(?:\/)?(?:\?.*)?$/,

    handler: "NetworkFirst",

    options: {
      cacheName: "servdial-public-api-v1",

      networkTimeoutSeconds: 3,

      cacheableResponse: {
        statuses: [200],
      },

      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
    },
  },
],

  navigateFallback: "index.html",

navigateFallbackAllowlist: [
  /^\/.*$/,
],

navigateFallbackDenylist: [
  /^\/api\//,
],

  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
},
            }),
          ]
    ),
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
