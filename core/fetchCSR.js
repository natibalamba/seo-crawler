import { chromium } from "playwright";
import { config } from "../config/env.js";

const AUTH_HEADER =
  "Basic " + Buffer.from(`${config.BASIC_USER}:${config.BASIC_PASS}`).toString("base64");

export async function fetchCSR(url, browser) {
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    Authorization: AUTH_HEADER
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);

    const html = await page.content();
    await page.close();
    return html;
  } catch (err) {
    console.error("CSR retry due to:", err.message);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2000);

      const html = await page.content();
      await page.close();
      return html;
    } catch (err2) {
      await page.close();
      throw new Error("CSR failed twice: " + err2.message);
    }
  }
}
