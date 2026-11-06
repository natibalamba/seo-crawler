import * as cheerio from "cheerio";

export function extractLinks(ssrHtml, csrHtml, baseUrl) {
  const links = new Set();

  const addLinks = (html) => {
    const $ = cheerio.load(html);

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      try {
        const full = new URL(href, baseUrl).href;

        if (
          full.includes("/trending/") ||
          full.includes("/news/") ||
          full.includes("/video/") ||
          full.includes("/gallery/")
        ) {
          links.add(full);
        }
      } catch {}
    });
  };

  addLinks(ssrHtml);
  addLinks(csrHtml);

  return Array.from(links);
}
