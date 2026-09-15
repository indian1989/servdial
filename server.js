import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

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