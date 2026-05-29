import { getServerSession } from "next-auth";
import { FileData, FolderData } from "@/components/content/types";
import FileQuery from "@/lib/query/file";
import utils from "@/lib/utils";
import { searchFolder } from "@/lib/query/folder";


export async function queryFiles(query: string): Promise<FileData[]> {
  if (query === "") return [];

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
  const fileWhere = { name: { contains: query } };
  const files = await FileQuery.readMany({ email }, {}, fileWhere, select);
  return files.map((f) => utils.map2FileData(email, f));
}


export async function queryFolders(query: string): Promise<FolderData[]> {
  if (query === "") return [];

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
  const folders = await searchFolder({ email }, query, select);
  return folders.map((f) => utils.map2FolderData(email, f));
}
