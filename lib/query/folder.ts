import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";


export async function getOrCreateRootFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  select?: Prisma.FolderSelect | undefined,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  const user = await prisma.user.findUniqueOrThrow({
    where: userWhere,
    select: { id: true },
  });

  const root = await prisma.folder.findFirst({
    where: { userId: user.id, parentId: 0 },
    select,
  });

  if (root) return root;

  return prisma.folder.create({
    data: {
      userId: user.id,
      id: 0,
      name: "",
      parentId: 0
    },
    select,
  });
}

export async function getFolders(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere?: Prisma.FolderWhereInput | undefined,
  select?: Prisma.FolderSelect | undefined,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>[]> {
  return await prisma.folder.findMany({
    where: {
      user: userWhere,
      ...(folderWhere ?? {}),
      NOT: { id: 0 },
    },
    select,
  });
}

export async function folderExists(
  where: Prisma.FolderWhereInput,
): Promise<boolean> {
  const folder = await prisma.folder.findFirst({ where, select: { id: true } });
  return folder !== null;
}

export async function createFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  parentWhere: Prisma.FolderWhereUniqueInput,
  folderValues: Omit<Prisma.FolderCreateInput, "user" | "parent" | "name"> & Record<"name", string>,
  select?: Prisma.FolderSelect | undefined,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  return await prisma.folder.create({
    data: {
      user: { connect: userWhere },
      parent: { connect: parentWhere },
      ...folderValues,
    },
    select,
  });
}
