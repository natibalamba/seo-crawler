import * as cheerio from "cheerio";

export function extractSEO(html) {
const $ = cheerio.load(html);
 
return {
title: $("title").text() || null,
 
description:
$('meta[name="description"]').attr("content") || null,
 
robots:
$('meta[name="robots"]').attr("content") || null,
 
canonical:
$('link[rel="canonical"]').attr("href") || null,
 
htmlLang:
$("html").attr("lang") || null,
 
ogImageAlt:
  $('meta[property="og:image:alt"]').attr("content") || null,
ogTitle:
$('meta[property="og:title"]').attr("content") || null,
 
ogDescription:
$('meta[property="og:description"]').attr("content") || null,
 
ogImage:
$('meta[property="og:image"]').attr("content") || null,
 
ogUrl:
$('meta[property="og:url"]').attr("content") || null,
 
ogType:
$('meta[property="og:type"]').attr("content") || null,
 
ogLocale:
$('meta[property="og:locale"]').attr("content") || null,
 
articlePublishedTime:
  $('meta[property="article:published_time"]')
    .attr("content") || null,
 
articleModifiedTime:
  $('meta[property="article:modified_time"]')
    .attr("content") || null,
 
ogSiteName:
  $('meta[property="og:site_name"]')
    .attr("content") || null,
         
hreflang: $('link[rel="alternate"][hreflang]')
.map((i, el) => ({
hreflang: $(el).attr("hreflang"),
href: $(el).attr("href")
}))
.get()
};
}

