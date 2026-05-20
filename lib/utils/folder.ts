import { FolderData } from "@/components/content/types";
import { formatDate } from "./date";
import { Prisma } from "@/app/generated/prisma";
type FolderWithUser = Prisma.FolderGetPayload<{
  select: {
    id: true,
    name: true,
    parent: {
      select: {
        parentId: true,
      },
    },
    user: {
      select: {
        name: true,
        email: true,
      },
    },
    updatedAt: true,
  },
}>;

export function folderToFolderData(
  ownerEmail: string,
  folder: FolderWithUser,
) {
  return {
    id: folder.id,
    name: folder.name,
    size: null,
    isMe: ownerEmail == folder.user.email,
    owner: folder.user.name,
    lastModified: formatDate(folder.updatedAt),
    reason: "in My Drive", // HARDCODE
    parentId: folder.parent?.parentId,
    type: "folder",
  } as FolderData;
}
