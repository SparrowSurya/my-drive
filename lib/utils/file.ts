import type { FileTree } from "@/lib/types/file";
import { Prisma } from "@/app/generated/prisma/client";
import { FileData } from "@/components/content/types";
import { detectMimeTypeFromBuffer } from "../mime/detection";
import { formatDate } from "./date";


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


type FileAndDataWithFolderAndUser = Prisma.FileGetPayload<{
  select: {
    id: true,
    name: true,
    size: true,
    folderId: true,
    mimeType: true,
    folder: {
      select: {
        name: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    },
    updatedAt: true,
  }
}>;

type FileWithFolderAndUser = Prisma.FileGetPayload<{
  select: {
    id: true,
    name: true,
    size: true,
    folderId: true,
    mimeType: true,
    folder: {
      select: {
        name: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    },
    updatedAt: true,
    data: true,
  }
}>;

export function fileToFileData(
  ownerEmail: string,
  file: FileAndDataWithFolderAndUser | FileWithFolderAndUser,
): FileData {
  const hasData = "data" in file;
  return {
    id: file.id,
    name: file.name,
    size: formatBytes(file.size),
    mimeType: file.mimeType === "" && hasData
      ? detectMimeTypeFromBuffer(file.data).mimeType
      : file.mimeType ?? "application/octet-stream",
    isMe: ownerEmail == file.folder.user.email,
    owner: file.folder.user.name,
    updatedAt: file.updatedAt,
    lastModified: formatDate(file.updatedAt),
    reason: "You uploaded", // HARDCODE
    data: hasData ? file.data : undefined,
    folderId: file.folderId,
    parent: file.folder.name,
    type: "file",
  } as FileData;
}
