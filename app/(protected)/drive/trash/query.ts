import { ContentGroupData } from "@/components/content/types";
import { getDeletedFiles } from "@/lib/query/file";
import utils from "@/lib/utils";
import { groupByTimeline } from "@/lib/utils/date";
import { getServerSession } from "next-auth";


export async function getTrashFiles(): Promise<ContentGroupData> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return {} as ContentGroupData;

  const select = {
    id: true,
    name: true,
    deletedAt: true,
    size: true,
    folderId: true,
    mimeType: true,
    folder: {
      select: {
        name: true,
        user: {
          select: { name: true, email: true },
        }
      },
    }
  };
  const files = await getDeletedFiles({ email }, select);
  const filesData = files.map(f => utils.fileToFileData(email, f));
  return groupByTimeline(filesData, (i) => i.deletedAt!);
}
