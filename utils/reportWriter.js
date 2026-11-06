import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import fs from "fs";

export function writeReports(results) {
  // Normalizar hreflang para que no aparezca [object Object]
  const normalizedResults = results.map(item => ({
    ...item,
    hreflang: item.hreflang ? JSON.stringify(item.hreflang) : ""
  }));

  // JSON report
  fs.writeFileSync("seo-report.json", JSON.stringify(normalizedResults, null, 2));

  // CSV report
  const csvWriter = createCsvWriter({
    path: "seo-report.csv",
    header: [
      { id: "url", title: "URL" },
      { id: "type", title: "TYPE" },
      { id: "status", title: "STATUS" },
      { id: "title", title: "TITLE" },
      { id: "description", title: "DESCRIPTION" },
      { id: "canonical", title: "CANONICAL" },
      { id: "ogTitle", title: "OG_TITLE" },
      { id: "ogDescription", title: "OG_DESCRIPTION" },
      { id: "ogImage", title: "OG_IMAGE" },
      { id: "ogUrl", title: "OG_URL" },
      { id: "hreflang", title: "HREFLANG" },
      { id: "issues", title: "ISSUES" },
      { id: "detectedLang", title: "DETECTED_LANG" },
      { id: "langFromUrl", title: "LANG_FROM_URL" },
      { id: "langFromHreflang", title: "LANG_FROM_HREFLANG" },
      { id: "htmlLang", title: "HTML_LANG" },
      { id: "robots", title: "ROBOTS" },
      { id: "ogType", title: "OG_TYPE" },
      { id: "ogLocale", title: "OG_LOCALE" },
      { id: "hreflangCount", title: "HREFLANG_COUNT" },
      { id: "articlePublishedTime", title: "ARTICLE_PUBLISHED_TIME" },
      { id: "articleModifiedTime", title: "ARTICLE_MODIFIED_TIME" },
      { id: "ogSiteName", title: "OG_SITE_NAME" },
    ]
  });

  return csvWriter.writeRecords(normalizedResults);
}