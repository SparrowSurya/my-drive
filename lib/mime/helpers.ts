import { MagicSignature } from "./typedef";

/** Convert a hex string to a Uint8Array for byte comparison. */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Read the first `byteCount` bytes of a File or Blob as a Uint8Array.
 * Safe to call in browser and in Node.js (via Web Streams / arrayBuffer).
 */
export async function readHeader(file: File | Blob, byteCount: number): Promise<Uint8Array> {
  const slice = file.slice(0, byteCount);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}

/** Check whether `bytes` contains `signature` at `offset`. */
export function matchesSignature(bytes: Uint8Array, sig: MagicSignature): boolean {
  const sigBytes = hexToBytes(sig.hex);
  if (bytes.length < sig.offset + sigBytes.length) return false;
  for (let i = 0; i < sigBytes.length; i++) {
    if (bytes[sig.offset + i] !== sigBytes[i]) return false;
  }
  return true;
}

/**
 * Disambiguate RIFF-container formats (WAV vs WebP vs AVI)
 * by inspecting bytes 8–11 of the RIFF header.
 */
export function resolveRiff(bytes: Uint8Array): string {
  if (bytes.length < 12) return "application/octet-stream";
  const sub = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  if (sub === "WAVE") return "audio/wav";
  if (sub === "WEBP") return "image/webp";
  if (sub === "AVI ") return "video/avi";
  return "application/octet-stream";
}
