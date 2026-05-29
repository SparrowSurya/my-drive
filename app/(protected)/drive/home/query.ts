import { FileData, FolderData } from "@/components/content/types";
import FileQuery from "@/lib/query/file";
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
    starred: true,
    folder: {
      select: {
        id: true,
        name: true,
        user: { select: { name: true, email: true } },
      },
    },
    updatedAt: true,
  } as const;
  const options = {
    take: count,
    orderBy: { createdAt: "desc" },
  } as const;
  const files = await FileQuery.readMany({ email }, {}, { deletedAt: null }, select, options);

  return files.map((f) => utils.map2FileData(email, f));
}

export async function getFolderSuggestions(count?: number): Promise<FolderData[]> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return [];

  const select = {
    id: true,
    name: true,
    starred: true,
    parent: { select: { id: true } },
    user: { select: { name: true, email: true } },
    updatedAt: true,
  } as const;
  const folders = await getRecentFolders({ email }, select, count);
  return folders.map((f) => utils.map2FolderData(email, f));
}
