import { getServerSession } from "next-auth";
import { GroupedContentData } from "@/components/content/types";
import { FileQuery } from "@/lib/query";
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
    starred: true,
    folder: {
      select: {
        id: true,
        name: true,
        user: { select: { name: true, email: true } },
      },
    },
  } as const;
  const files = await FileQuery.readMany({ email }, {}, { deletedAt: null }, select, { take: count });
  const filesData = files.map((f) => utils.map2FileData(email, f));
  filesData.forEach((f) => f.reason = undefined);
  return groupByTimeline(filesData, (i) => i.updatedAt!);
}
