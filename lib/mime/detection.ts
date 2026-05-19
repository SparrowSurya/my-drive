import { CUSTOM_MAP } from "./constants";
import { MAGIC_SIGNATURES } from "./data";
import { matchesSignature, readHeader, resolveRiff } from "./helpers";
import { resolveBrowserRenderable, resolveCategory, resolvePlainText } from "./resolvers";
import { MimeDetectionResult } from "./typedef";


/**
 * Detects the MIME type of a File or Blob using magic bytes first,
 * falling back to the custom checks (when a File object is provided).
 *
 * @param file - Browser `File` or `Blob` object
 * @returns MimeDetectionResult
 */
export async function detectMimeType(file: File | Blob): Promise<MimeDetectionResult> {
  // The farthest offset in MAGIC_SIGNATURES is 257 (TAR header), plus a bit.
  const HEADER_BYTES = 280;
  const header = await readHeader(file, HEADER_BYTES);

  // Magic byte detection
  for (const sig of MAGIC_SIGNATURES) {
    if (matchesSignature(header, sig)) {
      // RIFF container: need offset-8 disambiguation
      if (sig.hex === "52494646") {
        const resolved = resolveRiff(header);
        return buildResult(resolved, "magic");
      }
      return buildResult(sig.mimeType, "magic");
    }
  }

  // Custom fallback
  if (file instanceof File && file.name) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const fromExt = CUSTOM_MAP[ext];
    if (fromExt) return buildResult(fromExt, "custom");
  }

  // Browser-reported type as a hint (unreliable, last resort)
  if (file.type && file.type !== "application/octet-stream") {
    return buildResult(file.type, "custom");
  }

  return buildResult("application/octet-stream", "fallback");
}

/**
 * Server-side variant: accepts a Buffer / Uint8Array and an optional filename.
 * Use this in Next.js API routes or Server Actions where `File` is unavailable.
 *
 * @example
 * // pages/api/upload.ts  or  app/api/upload/route.ts
 * const buffer = Buffer.from(await file.arrayBuffer());
 * const result = detectMimeTypeFromBuffer(buffer, file.name);
 */
export function detectMimeTypeFromBuffer(
  buffer: Uint8Array | Buffer,
  filename?: string
): MimeDetectionResult {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  // Magic bytes
  for (const sig of MAGIC_SIGNATURES) {
    if (matchesSignature(bytes, sig)) {
      if (sig.hex === "52494646") {
        return buildResult(resolveRiff(bytes), "magic");
      }
      return buildResult(sig.mimeType, "magic");
    }
  }

  // Custom fallback
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const fromExt = CUSTOM_MAP[ext];
    if (fromExt) return buildResult(fromExt, "custom");
  }

  return buildResult("application/octet-stream", "fallback");
}

/**
 * Detects MIME type purely from a URL's pathname extension.
 * Useful when you have a remote URL and no file buffer.
 */
export function detectMimeTypeFromUrl(url: string): MimeDetectionResult {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
    const fromExt = CUSTOM_MAP[ext];
    if (fromExt) return buildResult(fromExt, "custom");
  } catch {
    // Invalid URL — fall through
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