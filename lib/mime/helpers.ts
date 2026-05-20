import { MagicSignature } from "./typedef";

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
  if (bytes.length < sig.offset + sig.bytes.length) return false;
  
  for (let i = 0; i < sig.bytes.length; i++) {
    if (bytes[sig.offset + i] !== sig.bytes[i]) return false;
  }
  return true;
}

/**
 * Disambiguate RIFF-container formats (WAV vs WebP vs AVI)
 * by inspecting bytes 8–11 of the RIFF header.
 */
export function resolveRiff(bytes: Uint8Array): string {
  if (bytes.length < 12) return "application/octet-stream";
  
  // Bytes 8-11 contain the format type
  const sub = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  
  switch (sub) {
    case "WAVE": return "audio/wav";
    case "WEBP": return "image/webp";
    case "AVI ": return "video/avi";
    default: return "application/octet-stream";
  }
}

/**
 * Heuristic to detect if a byte array is likely plain text.
 */
export function isTextBytes(bytes: Uint8Array): boolean {
  if (bytes.length === 0) return true;
  
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    
    // Null bytes are almost always binary files.
    // Standard ASCII/UTF-8 text won't have them in the first 512 bytes usually.
    if (byte === 0x00) {
      return false;
    }
  }
  
  return true;
}
