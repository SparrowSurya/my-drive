import { fileTypes, fileTypesGroup } from "@/lib/data/fileExtensions";
import type { FileType, FileTree } from "@/lib/types/file";


/**
 * Determines the folderId based on the pathname (without search params)
 * @param path url pathname
 * @returns number as folderId (0 if it is root)
 */
export function getFolderIdByPathname(path: string): number {
  if (/^\/drive\/folder\/[0-9]+$/.test(path)) {
    const folderId = path.split("/")[3];
    try {
      return parseInt(folderId);
    } catch {
      return 0;
    }
  }
  return 0;
}

/**
 * Provides file extension from filename
 * @param name name of the file (can include dotfiles)
 * @returns string representing file extension (empty string for dotfiles)
 */
export const getFileExt = (name: string): string => {
  return name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

/**
 * Provides the file type recognised (by the application)
 * @param name filename
 * @returns file type based on the file extension
 */
export function getFileType(name: string): FileType {
  const ext = getFileExt(name);
  for (const [key, values] of Object.entries(fileTypesGroup)) {
    if (values.includes(ext)) return key as FileType;
  }
  return (ext in fileTypes) ? ext as FileType : "file";
}

/**
 * Determines the correct "Content-Type" header for file
 * @param name filename (with extension)
 * @returns "Content-Type" header Value
 */
export const getContentType = (name: string): string => {
  const ext = getFileExt(name)
  const filetype = getFileType(name);

  switch (filetype) {
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "pdf":
      return "application/pdf";
    case "zip":
    case "folder":
      return "application/zip";
    case "txt":
      return "text/plain; charset=utf-8";
    case "csv":
      return "text/csv; charset=utf-8";
    case "audio":
      return `audio/${ext}`;
    case "video":
      return `video/${ext}`;
    case "image":
      return `image/${ext}`;
    case "code":
      return "text/plain; charset=utf-8";
    case "file":
    default:
      return "application/octet-stream";
  }
};


/**
 * Creates a directory structure based on the array of filepaths
 * @param files array of filepaths with one key as path
 * @returns Tree like structure as object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildDirectory<T extends Record<"path", any>>(files: T[]): FileTree<T> {
  const tree: FileTree<T> = {};

  for (const file of files) {
    const segments = file.path.split('/') as string[];
    segments.pop(); // drop the filename
    let currTree = tree;

    for (const segment of segments) {
      if (!currTree[segment]) {
        currTree[segment] = {};
      }
      currTree = currTree[segment] as FileTree<T>;
    }

    if (!currTree['.']) {
      currTree['.'] = [];
    }

    (currTree['.'] as T[]).push({ ...file, path: undefined });
  }

  return tree;
}


/**
 * Provides a readable representation of file size
 * @param bytes size as bytes
 * @returns a string describing the readable value
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);

  return `${formatted} ${sizes[i]}`;
}
