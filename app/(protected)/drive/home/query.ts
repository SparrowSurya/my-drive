import { FileData, FolderData } from "@/components/content/types";
import { getRecentFiles } from "@/lib/query/file";
import { getRecentFolders } from "@/lib/query/folder";
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
    mimeType: true,
    folder: {
      select: {
        name: true,
        user: { select: { name: true, email: true } },
      },
    },
    updatedAt: true,
  } as const;
  const files = await getRecentFiles({ email }, select, count);
  return files.map((f) => utils.fileToFileData(email, f));
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
  return folders.map((f) => utils.folderToFolderData(email, f));
}
