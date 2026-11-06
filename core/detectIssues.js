import { detectPageType } from "./pageType.js";
import { isSoft404 } from "./isSoft404.js";

export function detectIssues(url, ssr, csr, ssrStatus) {
  const issues = [];

  const pageType = detectPageType(url);

  if (ssrStatus >= 400) {
    issues.push(`SSR HTTP status ${ssrStatus}`);
    return issues;
  }

  // -------------------------
  // Missing Metadata
  // -------------------------

  if (!csr.description)
    issues.push("Missing meta description");

  if (!csr.canonical)
    issues.push("Missing canonical");

  if (!csr.ogTitle)
    issues.push("Missing OG title");

  if (!csr.ogDescription)
    issues.push("Missing OG description");

  if (!csr.ogImage)
    issues.push("Missing OG image");

  if (!csr.ogUrl)
    issues.push("Missing OG url");

  if (!csr.ogType)
    issues.push("Missing OG type");

  if (!csr.ogLocale)
    issues.push("Missing OG locale");

  if (
  (pageType === "Video" || pageType === "Gallery") &&
  !csr.articlePublishedTime
) {
  issues.push(
    "UFCUD-49: Missing article:published_time"
  );
}

if (
  (pageType === "Video" || pageType === "Gallery") &&
  !csr.articleModifiedTime
) {
  issues.push(
    "UFCUD-49: Missing article:modified_time"
  );
}

if (
  ssr.articlePublishedTime !==
  csr.articlePublishedTime
) {
  issues.push(
    "SSR/CSR mismatch: article:published_time"
  );
}

if (
  ssr.articleModifiedTime !==
  csr.articleModifiedTime
) {
  issues.push(
    "SSR/CSR mismatch: article:modified_time"
  );
}

if (
  (pageType === "Video" || pageType === "Gallery") &&
  csr.ogSiteName &&
  csr.ogSiteName !== "UFC"
) {
  issues.push(
    `UFCUD-49: Unexpected og:site_name (${csr.ogSiteName})`
  );
}


  // -------------------------
  // Hreflang Validation
  // -------------------------

  if (csr.hreflang.length === 0)
    issues.push("No hreflang annotations");

  if (
    pageType === "Article" &&
    csr.hreflang.length === 0
  ) {
    issues.push(
      "UFCUD-29: Article page missing hreflang annotations"
    );
  }

  // -------------------------
  // SSR vs CSR Comparison
  // -------------------------

  if (ssr.title !== csr.title)
    issues.push("SSR/CSR mismatch: title");

  if (ssr.description !== csr.description)
    issues.push("SSR/CSR mismatch: description");

  if (ssr.canonical !== csr.canonical)
    issues.push("SSR/CSR mismatch: canonical");

  if (ssr.ogTitle !== csr.ogTitle)
    issues.push("SSR/CSR mismatch: OG title");

  if (ssr.ogDescription !== csr.ogDescription)
    issues.push("SSR/CSR mismatch: OG description");

  if (ssr.ogImage !== csr.ogImage)
    issues.push("SSR/CSR mismatch: OG image");

  if (ssr.ogUrl !== csr.ogUrl)
    issues.push("SSR/CSR mismatch: OG url");

  if (ssr.ogType !== csr.ogType)
    issues.push("SSR/CSR mismatch: OG type");

  if (ssr.ogLocale !== csr.ogLocale)
    issues.push("SSR/CSR mismatch: OG locale");

  const ssrHref = JSON.stringify(ssr.hreflang);
  const csrHref = JSON.stringify(csr.hreflang);

  if (ssrHref !== csrHref)
    issues.push("SSR/CSR mismatch: hreflang");

  // -------------------------
  // Pantheon Validation
  // -------------------------

  if (
    csr.canonical &&
    csr.canonical.includes("pantheon-multidev")
  ) {
    issues.push("Canonical points to Pantheon");
  }

  if (
    csr.ogUrl &&
    csr.ogUrl.includes("pantheon-multidev")
  ) {
    issues.push("OG:url points to Pantheon");
  }

  // -------------------------
  // Soft 404 Validation
  // -------------------------

  if (
    ssrStatus === 200 &&
    isSoft404(url, csr)
  ) {
    issues.push("Potential soft 404");
  }

  if (csr.canonical) {
  try {
    const urlHost = new URL(url).hostname;
    const canonicalHost = new URL(csr.canonical).hostname;

    if (urlHost !== canonicalHost) {
      issues.push("Canonical host mismatch");
    }
  } catch {}
}

  return issues;
}