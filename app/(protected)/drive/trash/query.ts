import { GroupedContentData } from "@/components/content/types";
import { getDirectDeletedFiles } from "@/lib/query/file";
import { getDirectDeletedFolders } from "@/lib/query/folder";
import utils from "@/lib/utils";
import { groupByTimeline } from "@/lib/utils/date";
import { getServerSession } from "next-auth";


export async function getTrashFiles(): Promise<GroupedContentData> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return {} as GroupedContentData;

  const fileSelect = {
    id: true,
    name: true,
    updatedAt: false,
    deletedAt: true,
    size: true,
    folderId: true,
    mimeType: true,
    folder: {
      select: {
        id: true,
        name: true,
        user: {
          select: { name: true, email: true },
        }
      },
    }
  };

  const folderSelect = {
    id: true,
    name: true,
    updatedAt: false,
    deletedAt: true,
    user: {
      select: { name: true, email: true },
    }
  }

  const [files, folders] = await Promise.all([
    getDirectDeletedFiles({ email }, fileSelect),
    getDirectDeletedFolders({ email }, folderSelect),
  ]);

  const filesData = files.map(f => utils.map2FileData(email, f));
  const foldersData = folders.map(f => utils.map2FolderData(email, f));

  const content = [...filesData, ...foldersData];
  content.forEach((f) => f.reason = undefined);
  return groupByTimeline(content, (i) => i.deletedAt!);
}
