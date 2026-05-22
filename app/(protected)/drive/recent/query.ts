import { getServerSession } from "next-auth";
import { GroupedContentData } from "@/components/content/types";
import { getRecentFiles } from "@/lib/query/file";
import utils from "@/lib/utils";
import { groupByTimeline } from "@/lib/utils/date";


export async function getRecentFilesData(count?: number): Promise<GroupedContentData> {
  const session = await getServerSession();
  const email = session?.user.email;
  if (email == null) return {} as GroupedContentData;

  const select = {
    id: true,
    name: true,
    size: true,
    folderId: true,
    mimeType: true,
    updatedAt: true,
    folder: {
      select: {
        folderId: true,
        name: true,
        user: { select: { name: true, email: true } },
      },
    },
  } as const;
  const files = await getRecentFiles({ email }, select, count);
  const filesData = files.map((f) => utils.map2FileData(email, f));
  return groupByTimeline(filesData, (i) => i.updatedAt!);
}
