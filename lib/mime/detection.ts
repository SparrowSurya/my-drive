import { CUSTOM_MAP } from "./constants";
import { MAGIC_SIGNATURES } from "./data";
import { matchesSignature, readHeader, resolveRiff, isTextBytes } from "./helpers";
import { resolveBrowserRenderable, resolveCategory, resolvePlainText } from "./resolvers";
import { MimeDetectionResult } from "./typedef";


/**
 * Detects the MIME type of a File or Blob using magic bytes first,
 * falling back to custom and heuristic checks.
 *
 * @param file - Browser `File` or `Blob` object
 * @returns MimeDetectionResult
 */
export async function detectMimeType(file: File | Blob): Promise<MimeDetectionResult> {
  const HEADER_BYTES = 512;
  const header = await readHeader(file, HEADER_BYTES);

  // 1. Magic byte detection (Strict byte sequence matching)
  for (const sig of MAGIC_SIGNATURES) {
    if (matchesSignature(header, sig)) {
      // Disambiguate RIFF containers (WAV, WebP, AVI)
      if (sig.mimeType === "application/octet-stream" && sig.description === "RIFF Container") {
        const resolved = resolveRiff(header);
        return buildResult(resolved, "magic");
      }
      return buildResult(sig.mimeType, "magic");
    }
  }

  // 2. SVG / XML Detection (Binary scanning for tags)
  try {
    const headerString = new TextDecoder("utf-8", { fatal: false }).decode(header).toLowerCase();
    if (headerString.includes("<svg") || (headerString.includes("<?xml") && headerString.includes("<svg"))) {
      return buildResult("image/svg+xml", "magic");
    }
    if (headerString.includes("<?xml")) {
      return buildResult("application/xml", "magic");
    }
  } catch {
    // Ignore decoding errors for non-textual data
  }

  // 3. Custom fallback (Filename Extensions)
  if (file instanceof File && file.name) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const fromExt = CUSTOM_MAP[ext];
    if (fromExt) return buildResult(fromExt, "custom");
  }

  // 4. Browser-reported type (Last hint before heuristics)
  if (file.type && file.type !== "application/octet-stream" && file.type !== "") {
    return buildResult(file.type, "custom");
  }

  // 5. Heuristic text detection (Check for printable bytes / no nulls)
  if (isTextBytes(header)) {
    return buildResult("text/plain", "fallback");
  }

  // 6. Final Fallback
  return buildResult("application/octet-stream", "fallback");
}

/**
 * Server-side variant: accepts a Buffer / Uint8Array and an optional filename.
 */
export function detectMimeTypeFromBuffer(
  buffer: Uint8Array | Buffer,
  filename?: string
): MimeDetectionResult {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const sampleSize = Math.min(bytes.length, 512);
  const sample = bytes.slice(0, sampleSize);

  // 1. Magic byte detection
  for (const sig of MAGIC_SIGNATURES) {
    if (matchesSignature(bytes, sig)) {
      if (sig.mimeType === "application/octet-stream" && sig.description === "RIFF Container") {
        return buildResult(resolveRiff(bytes), "magic");
      }
      return buildResult(sig.mimeType, "magic");
    }
  }

  // 2. SVG / XML Detection
  try {
    const headerString = new TextDecoder("utf-8", { fatal: false }).decode(sample).toLowerCase();
    if (headerString.includes("<svg") || (headerString.includes("<?xml") && headerString.includes("<svg"))) {
      return buildResult("image/svg+xml", "magic");
    }
    if (headerString.includes("<?xml")) {
      return buildResult("application/xml", "magic");
    }
  } catch {
    // Ignore
  }

  // 3. Custom fallback (Extensions)
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const fromExt = CUSTOM_MAP[ext];
    if (fromExt) return buildResult(fromExt, "custom");
  }

  // 4. Heuristic text detection
  if (isTextBytes(sample)) {
    return buildResult("text/plain", "fallback");
  }

  return buildResult("application/octet-stream", "fallback");
}

/**
 * Detects MIME type purely from a URL's pathname extension.
 */
export function detectMimeTypeFromUrl(url: string): MimeDetectionResult {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
    const fromExt = CUSTOM_MAP[ext];
    if (fromExt) return buildResult(fromExt, "custom");
  } catch {
    // Fall through
  }
  return buildResult("application/octet-stream", "fallback");
}

function buildResult(
  mimeType: string,
  source: MimeDetectionResult["source"]
): MimeDetectionResult {
  return {
    mimeType,
    source,
    category: resolveCategory(mimeType),
    isPlainText: resolvePlainText(mimeType),
    isBrowserRenderable: resolveBrowserRenderable(mimeType),
  };
}
