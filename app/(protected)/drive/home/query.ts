import { FileData, FolderData } from "@/components/content/types";
import { getRecentFiles } from "@/lib/query/file";
import { getRecentFolders } from "@/lib/query/folder";
import { FileType } from "@/lib/types/file";
import utils from "@/lib/utils";
import { getServerSession } from "next-auth";


export async function getFileSuggestions(count?: number): Promise<FileData[]> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return [];

  const select = {
    id: true,
    name: true,
    size: true,
    folderId: true,
    folder: { select: { user: { select: { name: true, email: true } } } },
    updatedAt: true,
  } as const;
  const files = await getRecentFiles({ email }, select, count);
  return files.map((f) => ({
    id: f.id,
    name: f.name,
    type: utils.getFileType(f.name) as Exclude<FileType, "folder">,
    size: utils.formatBytes(f.size),
    folderId: f.folderId,
    lastModified: utils.formatDate(f.updatedAt),
    owner: f.folder.user.email == email ? "me" : f.folder.user.name,
    reason: "You uploaded", // HARDCODE
  } as FileData));
}

export async function getFolderSuggestions(count?: number): Promise<FolderData[]> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return [];

  const select = {
    id: true,
    name: true,
    parent: { select: { parentId: true } },
    user: { select: { name: true, email: true } },
    updatedAt: true,
  } as const;
  const folders = await getRecentFolders({ email }, select, count);
  return folders.map((f) => ({
    id: f.id,
    name: f.name,
    type: "folder",
    size: null,
    parentId: f.parent?.parentId,
    lastModified: utils.formatDate(f.updatedAt),
    owner: f.user.email == email ? "me" : f.user.name,
    reason: "in My Drive", // HARDCODE
  } as FolderData));
}
