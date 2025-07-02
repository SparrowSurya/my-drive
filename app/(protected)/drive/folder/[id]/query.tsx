"use server";

import { File, Folder } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";


export async function getFolderContents(id: number): Promise<{
  files: Omit<File, "data" | "createdAt">[],
  folders: Omit<Folder, "userId" | "createdAt">[],
}> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};

  const files = await prisma.file.findMany({
    where: {
      folder: {
        user: { email },
      },
      folderId: id,
    },
    select: {
      id: true,
      folderId: true,
      name: true,
      size: true,
      updatedAt: true,
    },
  });
  const folders = await prisma.folder.findMany({
    where: {
      user: { email },
      id,
    },
    select: {
      id: true,
      parentId: true,
      name: true,
      updatedAt: true,
    },
  });

  return { files, folders };
}
