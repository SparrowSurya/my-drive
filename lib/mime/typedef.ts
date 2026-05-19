
/**
 * Source of the mime detection:
 * 1. magic: reads the file's binary header
 * 2. custom: fallback when binary sniffing inconclusive
 * 3. default: when nothing matches (take it as binary)
 */
export type MimeDetectionSource = "magic" | "custom" | "fallback";

/** Identified mime categories */
export type MimeCategory =
  | "image"
  | "audio"
  | "video"
  | "pdf"
  | "text"
  | "spreadsheet"
  | "presentation"
  | "document"
  | "archive"
  | "font"
  | "model"
  | "binary"
  | "unknown";


/** Result of the mime type detection */
export interface MimeDetectionResult {
  mimeType: string;
  source: MimeDetectionSource;
  category: MimeCategory;
  isPlainText: boolean;
  isBrowserRenderable: boolean;
}

/** Predefined signatures for binary files. */
export interface MagicSignature {
  offset: number;
  hex: string;
  mimeType: string;
}

