import { getServerSession } from "next-auth";
import { getOrCreateRootFolder, getFolders } from "@/lib/query/folder";
import { getFiles } from "@/lib/query/file";
import utils from "@/lib/utils";
import type { ContentData, FileData, FolderData } from "@/components/content/types";


export async function getFilesAndFolders(): Promise<ContentData[]> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return [];

  const root = await getOrCreateRootFolder({ email }, { id: true });
  const select = { id: true, name: true, updatedAt: true }
  const folders = await getFolders({ email }, { id: root.id }, { ...select, parent: { select: { parentId: true } } });
  const files = await getFiles({ email }, { id: root.id }, undefined, { ...select, size: true, folderId: true });

  return [
    ...folders.map(f => ({
      id: f.id,
      name: f.name,
      type: "folder",
      size: null,
      parentId: f.parent?.parentId,
      lastModified: utils.formatDate(f.updatedAt),
    } as unknown as FolderData)),
    ...files.map(f => ({
      id: f.id,
      name: f.name,
      type: utils.getFileType(f.name),
      size: utils.formatBytes(f.size),
      folderId: f.folderId,
      lastModified: utils.formatDate(f.updatedAt),
    } as unknown as FileData)),
  ] as ContentData[];
}
