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
  const select = { id: true, name: true, updatedAt: true };

  const fileSelect = {
    ...select,
    size: true,
    folderId: true,
    folder: {
      select: {
        user: {
          select: { name: true, email: true },
        }
      },
    }
  };
  const folderSelect = {
    ...select,
    parent: { select: { parentId: true } },
    user: { select: { name: true, email: true } },
  }

  const [files, folders] = await Promise.all([
    getFiles({ email }, fileSelect, { id: root.id }, undefined),
    getFolders({ email }, { id: root.id }, folderSelect),
  ]);

  return [
    ...folders.map(f => ({
      id: f.id,
      name: f.name,
      type: "folder",
      size: null,
      parentId: f.parent?.parentId,
      isMe: f.user.email == email,
      owner: f.user.name,
      lastModified: utils.formatDate(f.updatedAt),
    } as unknown as FolderData)),
    ...files.map(f => ({
      id: f.id,
      name: f.name,
      type: utils.getFileType(f.name),
      size: utils.formatBytes(f.size),
      folderId: f.folderId,
      isMe: f.folder.user.email == email,
      owner: f.folder.user.name,
      lastModified: utils.formatDate(f.updatedAt),
    } as unknown as FileData)),
  ] as ContentData[];
}
