# Overview
This project contains a modular SEO crawler designed to audit how our decoupled Next.js frontend exposes SEO‑critical metadata to search engines. Because the site relies heavily on client‑side rendering (CSR), many metadata elements (canonical, OG tags, hreflang, internal links, etc.) are not visible to traditional server‑side crawlers or Googlebot‑style HTML fetches.

To address this, the crawler performs two parallel passes on every page:

    - Server‑Side Rendering (SSR) using Axios + Googlebot user agent

    - Client‑Side Rendering (CSR) using Playwright (real browser)

It then compares both versions, identifies inconsistencies, and generates a structured SEO report.
The crawler focuses specifically on Trending, Article, Video, and Gallery pages.

# What the Crawler Does
- Crawls the site starting from a configured START_URL
- Simulates Googlebot to capture SSR HTML
- Uses Playwright to capture fully hydrated CSR HTML
- Extracts SEO metadata from both versions:
    * Title
    * Meta description
    * Canonical
    * Open Graph tags
    * Hreflang
- Detects SEO issues such as:
    * Missing metadata
    * SSR/CSR mismatches
    * Canonicals pointing to staging
    * Missing OG tags
- Discovers internal links from both SSR and CSR
- Restricts crawling to:
    /trending/
    /article/
    /video/
    /gallery/
- Generates:
    * seo-report.json
    * seo-report.csv
- Classifies each URL by TYPE (Trending, Article, Video, Gallery)

# Requirements
- Node.js
    Node 18+ recommended
    Fully compatible with Node 24 (ESM mode required)
- Dependencies
    Installed automatically via npm install:
        - axios
        - cheerio
        - playwright
        - csv-writer
        - dotenv

# Playwright Browsers
Install once:
    npx playwright install

# Project Structure
seo-crawler/
│
├── crawler-enterprise.js        ← main entry point
│
├── config/
│   └── env.js                   ← loads .env and exports config
│
├── core/
│   ├── fetchSSR.js              ← SSR fetcher
│   ├── fetchCSR.js              ← CSR fetcher (Playwright)
│   ├── extractSEO.js            ← metadata extractor
│   ├── detectIssues.js          ← SEO issue detector
│   ├── extractLinks.js          ← SSR + CSR link extractor
│   └── pageType.js              ← determines Trending / Article / Video / Gallery
│
├── utils/
│   ├── logger.js                ← console logging helpers
│   └── reportWriter.js          ← writes JSON + CSV
│
└── README.md

## How to Run the Crawler
1. Install dependencies> npm install
2. Install Playwright browser > npx playwright install
3. Ensure .env is correctly placed > Root folder, not inside seo-crawler/
4. Run the crawler > node seo-crawler/crawler-enterprise.js

# Output Files
seo-report.json
    Full structured output including:
        URL
        TYPE
        Status
        All metadata fields
        Hreflang array
        Issues list
seo-report.csv
    Spreadsheet‑friendly version with:
        URL
        TYPE
        STATUS
        TITLE
        DESCRIPTION
        CANONICAL
        OG tags
        HREFLANG
        ISSUES