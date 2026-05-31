import { ContentData } from "@/components/content/types";
import FileQuery from "@/lib/query/file";
import FolderQuery from "@/lib/query/folder";
import utils from "@/lib/utils";
import { getServerSession } from "next-auth";


export async function getStarredData(): Promise<ContentData[]> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (!email) return [];

  const fileSelect = {
    id: true,
    name: true,
    updatedAt: true,
    deletedAt: true,
    size: true,
    folderId: true,
    mimeType: true,
    starred: true,
    folder: {
      select: {
        id: true,
        name: true,
        user: {
          select: { name: true, email: true },
        }
      },
    }
  } as const;
  const fileOptions = {
    orderBy: { updatedAt: "desc" },
  } as const;

  const folderSelect = {
    id: true,
    name: true,
    updatedAt: true,
    deletedAt: true,
    starred: true,
    user: {
      select: { name: true, email: true },
    }
  } as const;

  const [files, folders] = await Promise.all([
    FileQuery.readMany({ email }, {}, { starred: true }, fileSelect, fileOptions),
    FolderQuery.readMany({ email }, { starred: true }, folderSelect),
  ]);

  const filesData = files.map(f => utils.map2FileData(email, f));
  const foldersData = folders.map(f => utils.map2FolderData(email, f));
  const content = [...foldersData, ...filesData];
  content.forEach((f) => f.reason = undefined)
  return content;
}
