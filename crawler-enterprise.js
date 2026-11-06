import { config } from "./config/env.js";
import { fetchSSR } from "./core/fetchSSR.js";
import { fetchCSR } from "./core/fetchCSR.js";
import { extractSEO } from "./core/extractSEO.js";
import { detectIssues } from "./core/detectIssues.js";
import { extractLinks } from "./core/extractLinks.js";
import { detectPageType } from "./core/pageType.js";
import { detectLanguage } from "./core/detectLanguage.js";
import { writeReports } from "./utils/reportWriter.js";
import { log } from "./utils/logger.js";
import { chromium } from "playwright";

const visited = new Set();
const results = [];

/**
 * Detect expected language from URL
 */
function langFromUrl(url) {
  if (url.includes("/es/")) return "spa";
  if (url.includes("/en/")) return "eng";
  if (url.includes("/pt-br/")) return "por";
  if (url.includes("/fr/")) return "fra";
  if (url.includes("/ja/")) return "jpn";
  if (url.includes("/ru/")) return "rus";
  if (url.includes("/ko/")) return "kor";
  return null;
}

/**
 * Detect expected language from hreflang
 */
function langFromHreflang(hreflangArray) {
  if (!hreflangArray || hreflangArray.length === 0) return null;
  const code = hreflangArray[0].hreflang;

  if (code.startsWith("es")) return "spa";
  if (code.startsWith("en")) return "eng";
  if (code.startsWith("pt")) return "por";
  if (code.startsWith("fr")) return "fra";
  if (code.startsWith("ja")) return "jpn";
  if (code.startsWith("ru")) return "rus";
  if (code.startsWith("ko")) return "kor";

  return null;
}

async function crawl(url, browser, depth = 0, maxDepth = 3) {
  if (!url || visited.has(url)) return;
  visited.add(url);

  log(`Crawling: ${url}`);

  try {
    // SSR
    const ssr = await fetchSSR(url);

    // CSR
    const csrHtml = await fetchCSR(url, browser);

    // SEO metadata
    const ssrSEO = extractSEO(ssr.html);
    const csrSEO = extractSEO(csrHtml);

    // Language detection
    const detectedLang = detectLanguage(csrHtml);
    const expectedLangFromUrl = langFromUrl(url);
    const expectedLangFromHreflang = langFromHreflang(csrSEO.hreflang);

    // Issues
    const issues = detectIssues(
      url,
      ssrSEO,
      csrSEO,
      ssr.status,
      detectedLang,
      expectedLangFromUrl,
      expectedLangFromHreflang
    );

    // Save result
results.push({
  url,
  type: detectPageType(url),
  status: ssr.status,

  title: csrSEO.title,
  description: csrSEO.description,

  canonical: csrSEO.canonical,
  detectedLang,
  langFromUrl: expectedLangFromUrl,
  langFromHreflang: expectedLangFromHreflang,

  htmlLang: csrSEO.htmlLang,
  robots: csrSEO.robots,

  ogTitle: csrSEO.ogTitle,
  ogDescription: csrSEO.ogDescription,
  ogImage: csrSEO.ogImage,
  ogUrl: csrSEO.ogUrl,
  ogType: csrSEO.ogType,
  ogLocale: csrSEO.ogLocale,

  hreflangCount: csrSEO.hreflang.length,
  hreflang: JSON.stringify(csrSEO.hreflang),

  articlePublishedTime:
  csrSEO.articlePublishedTime,

articleModifiedTime:
  csrSEO.articleModifiedTime,

ogSiteName:
  csrSEO.ogSiteName,

  issues: issues.join("; ")
});

    // Stop recursion
    if (depth >= maxDepth) return;

    // Discover links
    const links = extractLinks(ssr.html, csrHtml, url);

    for (const link of links) {
      await crawl(link, browser, depth + 1, maxDepth);
    }
  } catch (err) {
    console.error("Error crawling:", url, err.message);
  }
}

async function main() {
  log(`Starting SEO enterprise crawl from: ${config.START_URL}`);

  if (!config.START_URL) {
    console.error("ERROR: START_URL is undefined. Check your .env file.");
    return;
  }

  const browser = await chromium.launch({ headless: true });

  await crawl(config.START_URL, browser);

  await browser.close();

  writeReports(results);

  log("Crawl complete. Reports generated: seo-report.json, seo-report.csv");
}

main();
