
export const fileTypesGroup: Record<"image" | "audio" | "video" | "code", string[]> = {
  image: [ "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic", "tiff", "ico", "avif" ],
  audio: [ "mp3", "wav", "ogg", "flac", "aac", "m4a", "wma", "aiff", "alac", "opus" ],
  video: [ "mp4", "mkv", "avi", "mov", "wmv", "webm", "mpeg", "m4v" ],
  code: [ "js", "ts", "tsx", "jsx", "py", "java", "c", "cpp", "cs", "go", "php", "html", "css", "json", "xml", "yml", "yaml", "sh", "rs", "swift", "kt", "dart", "sql" ],
};

export const fileTypes = [
  "excel",
  "pptx",
  "docx",
  "pdf",
  "zip",
  "txt",
  "csv",
  "file",
  "audio",
  "video",
  "image",
  "code",
  "folder"
] as const;
