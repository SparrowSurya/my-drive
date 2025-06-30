import { fileExtGroup, fileIcons } from "./data";
import type { FileType } from "./types";


// Reads file extension from filename otherwise empty string
export const fileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

// Provides the file type of the file (if not recognied returns "file")
export function getFileType(name: string): FileType {
  const ext = fileExtension(name);
  for (const [key, values] of Object.entries(fileExtGroup)) {
    if (values.includes(ext)) return key as FileType;
  }
  return (ext in fileIcons) ? ext as FileType : "file";
}
