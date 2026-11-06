import { franc } from "franc";

export function detectLanguage(html) {
  const lang = franc(html);

  // franc devuelve "und" cuando no puede detectar idioma
  if (lang === "und") return null;

  return lang;
}
