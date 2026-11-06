function detectPageType(url) {
  if (url.includes("/trending/")) return "Trending";
  if (url.includes("/news/")) return "Article";
  if (url.includes("/video/")) return "Video";
  if (url.includes("/gallery/")) return "Gallery";

  return "Other";
}

export { detectPageType };
