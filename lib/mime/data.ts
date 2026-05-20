import { MagicSignature } from './typedef';

/**
 * Predefined signatures for binary files.
 * Sequence of 1-byte values as found in the file header.
 * 
 * Note: order mattters! more specific signatures should appear before generic ones.
 */
export const MAGIC_SIGNATURES: MagicSignature[] = [
  // Images
  { offset: 0, bytes: [0xFF, 0xD8, 0xFF], mimeType: "image/jpeg", description: "JPEG" },
  { offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mimeType: "image/png", description: "PNG" },
  { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], mimeType: "image/gif", description: "GIF87a" },
  { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], mimeType: "image/gif", description: "GIF89a" },
  { offset: 0, bytes: [0x42, 0x4D], mimeType: "image/bmp", description: "BMP" },
  { offset: 0, bytes: [0x49, 0x49, 0x2A, 0x00], mimeType: "image/tiff", description: "TIFF (little-endian)" },
  { offset: 0, bytes: [0x4D, 0x4D, 0x00, 0x2A], mimeType: "image/tiff", description: "TIFF (big-endian)" },
  { offset: 0, bytes: [0x00, 0x00, 0x01, 0x00], mimeType: "image/x-icon", description: "ICO" },
  { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], mimeType: "image/heic", description: "HEIC" },
  { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66], mimeType: "image/avif", description: "AVIF" },

  // Audio
  { offset: 0, bytes: [0x49, 0x44, 0x33], mimeType: "audio/mpeg", description: "MP3 with ID3v2" },
  { offset: 0, bytes: [0xFF, 0xFB], mimeType: "audio/mpeg", description: "MP3 (no ID3)" },
  { offset: 0, bytes: [0xFF, 0xF3], mimeType: "audio/mpeg", description: "MP3 (no ID3)" },
  { offset: 0, bytes: [0xFF, 0xF2], mimeType: "audio/mpeg", description: "MP3 (no ID3)" },
  { offset: 0, bytes: [0x4F, 0x67, 0x67, 0x53], mimeType: "audio/ogg", description: "OGG/OGA" },
  { offset: 0, bytes: [0x66, 0x4C, 0x61, 0x43], mimeType: "audio/flac", description: "FLAC" },
  { offset: 0, bytes: [0x4D, 0x54, 0x68, 0x64], mimeType: "audio/midi", description: "MIDI" },
  { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41, 0x20], mimeType: "audio/mp4", description: "M4A" },

  // Video
  { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D], mimeType: "video/mp4", description: "MP4 (ISO)" },
  { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32], mimeType: "video/mp4", description: "MP4 (v2)" },
  { offset: 0, bytes: [0x1A, 0x45, 0xDF, 0xA3], mimeType: "video/webm", description: "WebM/MKV" },
  { offset: 0, bytes: [0x00, 0x00, 0x01, 0xB3], mimeType: "video/mpeg", description: "MPEG Video" },
  { offset: 0, bytes: [0x00, 0x00, 0x01, 0xBA], mimeType: "video/mpeg", description: "MPEG Video" },
  { offset: 0, bytes: [0x46, 0x4C, 0x56, 0x01], mimeType: "video/x-flv", description: "FLV" },
  { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], mimeType: "video/quicktime", description: "MOV" },
  { offset: 0, bytes: [0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11], mimeType: "video/x-ms-wmv", description: "WMV" },

  // RIFF container (WAV, WebP, AVI) - Match the prefix
  { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46], mimeType: "application/octet-stream", description: "RIFF Container" },

  // PDF
  { offset: 0, bytes: [0x25, 0x50, 0x44, 0x46], mimeType: "application/pdf", description: "PDF" },

  // Archives
  { offset: 0, bytes: [0x50, 0x4B, 0x03, 0x04], mimeType: "application/zip", description: "ZIP" },
  { offset: 0, bytes: [0x50, 0x4B, 0x05, 0x06], mimeType: "application/zip", description: "ZIP (empty)" },
  { offset: 0, bytes: [0x50, 0x4B, 0x07, 0x08], mimeType: "application/zip", description: "ZIP (spanned)" },
  { offset: 0, bytes: [0x1F, 0x8B, 0x08], mimeType: "application/gzip", description: "GZIP" },
  { offset: 0, bytes: [0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00], mimeType: "application/x-xz", description: "XZ" },
  { offset: 0, bytes: [0x42, 0x5A, 0x68], mimeType: "application/x-bzip2", description: "BZIP2" },
  { offset: 0, bytes: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00], mimeType: "application/x-rar-compressed", description: "RAR v1.5" },
  { offset: 0, bytes: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00], mimeType: "application/x-rar-compressed", description: "RAR v5" },
  { offset: 257, bytes: [0x75, 0x73, 0x74, 0x61, 0x72], mimeType: "application/x-tar", description: "TAR" },
  { offset: 0, bytes: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], mimeType: "application/x-7z-compressed", description: "7Z" },

  // Fonts
  { offset: 0, bytes: [0x77, 0x4F, 0x46, 0x46], mimeType: "font/woff", description: "WOFF" },
  { offset: 0, bytes: [0x77, 0x4F, 0x46, 0x32], mimeType: "font/woff2", description: "WOFF2" },
  { offset: 0, bytes: [0x4F, 0x54, 0x54, 0x4F], mimeType: "font/otf", description: "OTF" },
  { offset: 0, bytes: [0x00, 0x01, 0x00, 0x00], mimeType: "font/ttf", description: "TTF" },

  // SQLite
  { offset: 0, bytes: [0x53, 0x51, 0x4C, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6F, 0x72, 0x6D, 0x61, 0x74, 0x20, 0x33, 0x00], mimeType: "application/x-sqlite3", description: "SQLite 3" },

  // Executables
  { offset: 0, bytes: [0x4D, 0x5A], mimeType: "application/x-msdownload", description: "EXE/DLL" },
  { offset: 0, bytes: [0x7F, 0x45, 0x4C, 0x46], mimeType: "application/x-elf", description: "ELF" },

  // WebAssembly
  { offset: 0, bytes: [0x00, 0x61, 0x73, 0x6D], mimeType: "application/wasm", description: "WASM" },
];
