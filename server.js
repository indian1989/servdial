import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

// ================================================
// SITEMAP
// ================================================

const BACKEND_URL =
  process.env.VITE_API_BASE_URL ||
  "https://api.servdial.com/api";

const BACKEND_SITEMAP_URL =
  BACKEND_URL.replace(/\/api$/, "");
  
// ================================================
// PRODUCTION STATIC ASSETS
// ================================================

const distPath = path.resolve(__dirname, "dist");
const ssrPath = path.resolve(__dirname, "dist-ssr");

app.use(
  express.static(distPath, {
    index: false,
  })
);

app.get(
  [
    "/sitemap.xml",
    "/sitemap-static.xml",
    "/sitemap-states.xml",
    "/sitemap-states-:page.xml",
    "/sitemap-cities.xml",
    "/sitemap-cities-:page.xml",
    "/sitemap-categories.xml",
    "/sitemap-categories-:page.xml",
    "/sitemap-city-category.xml",
    "/sitemap-city-category-:page.xml",
    "/sitemap-city-pages.xml",
    "/sitemap-city-pages-:page.xml",
    "/sitemap-businesses.xml",
    "/sitemap-businesses-:page.xml",
    "/sitemap-temporary-listings.xml",
"/sitemap-temporary-listings-:page.xml",
  ],
  async (req, res) => {
    try {
      const sitemapUrl =
        `${BACKEND_SITEMAP_URL}${req.originalUrl}`;

      console.log(
        "🗺️ Sitemap request:",
        req.originalUrl
      );

      const response = await fetch(sitemapUrl, {
        headers: {
          Accept: "application/xml",
        },
      });

      if (!response.ok) {
        console.error(
          "❌ Backend sitemap error:",
          response.status,
          sitemapUrl
        );

        return res
          .status(response.status)
          .send("Sitemap unavailable");
      }

      const xml = await response.text();

      res.setHeader(
        "Content-Type",
        "application/xml; charset=utf-8"
      );

      res.setHeader(
        "Cache-Control",
        "public, max-age=3600"
      );

      return res.status(200).send(xml);

    } catch (error) {

      console.error(
        "❌ Sitemap proxy error:",
        error
      );

      return res
        .status(500)
        .send("Sitemap unavailable");
    }
  }
);

// ================================================
// TEMPORARY SSR FOUNDATION
// ================================================

app.get("/{*splat}", async (req, res) => {
  try {
    const { render } = await import(
  "./dist-ssr/entry-server.js"
);

const {
  html,
  helmet,
} = await render(
  req.originalUrl
);

    console.log("🔎 SSR URL:", req.originalUrl);
console.log("🔎 SSR HTML LENGTH:", html?.length);

    let template = await fs.readFile(
      path.join(distPath, "index.html"),
      "utf-8"
    );

    // ================================================
    // INJECT SERVER-RENDERED REACT HTML
    // ================================================

    template = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    // ================================================
    // INJECT SSR SEO TAGS
    // ================================================

    const helmetTitle =
      helmet?.title?.toString() || "";

    const helmetMeta =
      helmet?.meta?.toString() || "";

    const helmetLink =
      helmet?.link?.toString() || "";

    const helmetScript =
      helmet?.script?.toString() || "";

    if (helmetTitle) {
      template = template.replace(
        /<title>[\s\S]*?<\/title>/i,
        helmetTitle
      );
    }

    template = template.replace(
      "</head>",
      `${helmetMeta}
${helmetLink}
${helmetScript}
</head>`
    );

    res.status(200).send(template);

  } catch (error) {
    console.error("❌ SSR render error:", error);

    res.sendFile(
      path.join(distPath, "index.html")
    );
  }
});

// ================================================
// SERVER START
// ================================================

app.listen(PORT, () => {
  console.log(
    `🚀 ServDial frontend server running on port ${PORT}`
  );
});