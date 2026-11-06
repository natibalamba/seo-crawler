function isSoft404(url, seo) {
  const title = (seo.title || "").toLowerCase();

  return (
    title.includes("404") ||
    title.includes("page not found") ||
    (
      title.includes("search results") &&
      !(seo.robots || "")
        .toLowerCase()
        .includes("noindex")
    )
  );
}

export { isSoft404 };