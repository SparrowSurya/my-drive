import { MagicSignature } from './typedef';

/**
 * Note: order mattters! more specific signatures should appear before generic ones.
 */
export const MAGIC_SIGNATURES: MagicSignature[] = [
  // Images
  { offset: 0, hex: "FFD8FF", mimeType: "image/jpeg" },
  { offset: 0, hex: "89504E470D0A1A0A", mimeType: "image/png" },
  { offset: 0, hex: "47494638", mimeType: "image/gif" },
  { offset: 0, hex: "52494646", mimeType: "image/webp" }, // refined below via offset 8
  { offset: 0, hex: "424D", mimeType: "image/bmp" },
  { offset: 0, hex: "49492A00", mimeType: "image/tiff" }, // little-endian TIFF
  { offset: 0, hex: "4D4D002A", mimeType: "image/tiff" }, // big-endian TIFF
  { offset: 0, hex: "00000100", mimeType: "image/x-icon" },
  { offset: 4, hex: "6674797068656963", mimeType: "image/heic" },
  { offset: 4, hex: "6674797061766966", mimeType: "image/avif" },

  // Audio
  { offset: 0, hex: "494433", mimeType: "audio/mpeg" }, // MP3 with ID3 tag
  { offset: 0, hex: "FFFB", mimeType: "audio/mpeg" }, // MP3 frame sync
  { offset: 0, hex: "FFF3", mimeType: "audio/mpeg" },
  { offset: 0, hex: "FFF2", mimeType: "audio/mpeg" },
  { offset: 0, hex: "4F676753", mimeType: "audio/ogg" }, // OGG/OGA
  { offset: 0, hex: "664C6143", mimeType: "audio/flac" },
  { offset: 0, hex: "52494646", mimeType: "audio/wav" }, // refined via offset 8 "57415645"
  { offset: 0, hex: "4D546864", mimeType: "audio/midi" },
  { offset: 4, hex: "667479704D344100", mimeType: "audio/mp4" }, // m4a

  // Video
  { offset: 4, hex: "6674797069736F6D", mimeType: "video/mp4" },
  { offset: 4, hex: "667479706D703432", mimeType: "video/mp4" },
  { offset: 4, hex: "66747970", mimeType: "video/mp4" }, // generic ftyp box
  { offset: 0, hex: "1A45DFA3", mimeType: "video/webm" }, // also MKV
  { offset: 0, hex: "000001B3", mimeType: "video/mpeg" },
  { offset: 0, hex: "000001BA", mimeType: "video/mpeg" },
  { offset: 0, hex: "52494646", mimeType: "video/avi" }, // refined via offset 8 "41564920"
  { offset: 0, hex: "464C5601", mimeType: "video/x-flv" },
  { offset: 4, hex: "6674797071742020", mimeType: "video/quicktime" }, // .mov
  { offset: 0, hex: "3026B2758E66CF11", mimeType: "video/x-ms-wmv" },

  // PDF
  { offset: 0, hex: "25504446", mimeType: "application/pdf" },

  // Archives
  { offset: 0, hex: "504B0304", mimeType: "application/zip" },
  { offset: 0, hex: "504B0506", mimeType: "application/zip" }, // empty ZIP
  { offset: 0, hex: "504B0708", mimeType: "application/zip" }, // spanned ZIP
  { offset: 0, hex: "1F8B08", mimeType: "application/gzip" },
  { offset: 0, hex: "FD377A585A00", mimeType: "application/x-xz" },
  { offset: 0, hex: "425A68", mimeType: "application/x-bzip2" },
  { offset: 0, hex: "526172211A0700", mimeType: "application/x-rar-compressed" },
  { offset: 0, hex: "526172211A070100", mimeType: "application/x-rar-compressed" },
  { offset: 257, hex: "7573746172", mimeType: "application/x-tar" },
  { offset: 0, hex: "377ABCAF271C", mimeType: "application/x-7z-compressed" },

  // Office Open XML (DOCX, XLSX, PPTX are all ZIP-based; resolved by extension)
  // The ZIP magic above covers them; extension fallback disambiguates.

  // Fonts
  { offset: 0, hex: "774F4646", mimeType: "font/woff" },
  { offset: 0, hex: "774F4632", mimeType: "font/woff2" },
  { offset: 0, hex: "4F54544F", mimeType: "font/otf" },
  { offset: 0, hex: "000100", mimeType: "font/ttf" },

  // SQLite
  { offset: 0, hex: "53514C69746520666F726D617420330", mimeType: "application/x-sqlite3" },

  // Executables (flag as binary)
  { offset: 0, hex: "4D5A", mimeType: "application/x-msdownload" }, // .exe / .dll
  { offset: 0, hex: "7F454C46", mimeType: "application/x-elf" },   // Linux ELF

  // WebAssembly
  { offset: 0, hex: "0061736D", mimeType: "application/wasm" },
];