import { BROWSER_RENDERABLE_MIMES, MIME_CATEGORY_MAP, PLAIN_TEXT_MIMES } from "./constants";
import { MimeCategory } from "./typedef";


export function resolveCategory(mimeType: string): MimeCategory {
  for (const [pattern, category] of MIME_CATEGORY_MAP) {
    if (pattern.test(mimeType)) return category;
  }
  return "unknown";
}

export function resolvePlainText(mimeType: string): boolean {
  if (PLAIN_TEXT_MIMES.has(mimeType)) return true;

  // Treat all text/* that aren't already listed as plain-text-capable
  return mimeType.startsWith("text/");
}

export function resolveBrowserRenderable(mimeType: string): boolean {
  return BROWSER_RENDERABLE_MIMES.has(mimeType);
}
