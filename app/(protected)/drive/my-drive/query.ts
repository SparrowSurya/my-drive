import { getServerSession } from "next-auth";
import { getOrCreateRootFolder, getFolders } from "@/lib/query/folder";
import { getFiles } from "@/lib/query/file";
import utils from "@/lib/utils";
import type { ContentData } from "@/components/content/types";


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
    mimeType: true,
    folder: {
      select: {
        folderId: true,
        name: true,
        user: { select: { name: true, email: true } },
      },
    },
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

  const contents = [
    ...folders.map(f => utils.map2FolderData(email, f)),
    ...files.map(f => utils.map2FileData(email, f)),
  ] as ContentData[];

  contents.forEach((f) => f.reason = undefined);
  return contents;
}
