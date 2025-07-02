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

export type FileTree<T> = {
  [key: string]: T[] | FileTree<T>,
};

export async function createFileTree(
  userWhere: Prisma.UserWhereUniqueInput,
  parentWhere: Prisma.FolderWhereUniqueInput,
  tree: FileTree<Omit<Prisma.FileCreateInput, "folder">>,
): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: userWhere,
    select: { id: true },
  });

  const parent = await prisma.folder.findUniqueOrThrow({
    where: {
      ...parentWhere,
      userId: user.id,
    },
    select: { id: true },
  });

  type QueueItem = {
    parentId: number,
    subtree: FileTree<Omit<Prisma.FileCreateInput, "folder">>,
  };

  const stack: QueueItem[] = [
    { parentId: parent.id, subtree: tree },
  ];

  while (stack.length > 0) {
    const { parentId, subtree } = stack.pop()!;

    for (const [name, value] of Object.entries(subtree)) {
      if (Array.isArray(value)) {
        for (const file of value) {
          const existingFile = await prisma.file.findUnique({
            where: { name_folderId: { folderId: parentId, name: file.name } },
            select: { id: true },
          });
          if (existingFile) continue;

          await prisma.file.create({
            data: {
              ...file,
              folder: { connect: { id: parentId } },
            },
          });
        }
      } else {
        const existingFolder = await prisma.folder.findUnique({
          where: { name_parentId: { parentId: parentId, name }},
          select: { id: true },
        });
        if (existingFolder) {
          stack.push({ parentId: existingFolder.id, subtree: value });
        } else {
          const newFolder = await prisma.folder.create({
            data: {
              name,
              parent: { connect: { id: parentId } },
              user: { connect: { id: user.id } },
            },
            select: { id: true },
          });
          stack.push({ parentId: newFolder.id, subtree: value });
        }
      }
    }
  }
}

export async function updateFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereUniqueInput,
  values: Prisma.FolderUpdateInput,
  select?: Prisma.FolderSelect,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  return await prisma.folder.update({
    where: {
      user: userWhere,
      ...folderWhere,
    },
    data: values,
    select,
  })
}

export async function getFolderSegments(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereUniqueInput,
  select?: Prisma.FolderSelect,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>[]> {
  const folder = await prisma.folder.findUniqueOrThrow({
    where: {
      user: userWhere,
      ...folderWhere,
    },
    select: { id: true, parentId: true },
  });

  const segments: Prisma.FolderGetPayload<{ select: Prisma.FolderSelect }>[] = [];
  let id = folder.id;
  const includeParentId = select ? !!select.parentId : true;

  while (id !== 0) {
    const folder = await prisma.folder.findUniqueOrThrow({
      where: { id },
      select: { parentId: true, ...(select ?? {}) },
    });

    id = folder.parentId;
    if (!includeParentId) {
      const { parentId, ...customFields } = folder; // eslint-disable-line @typescript-eslint/no-unused-vars
      segments.push(customFields as Prisma.FolderGetPayload<{ select: Prisma.FolderSelect }>);
    } else {
      segments.push(folder as Prisma.FolderGetPayload<{ select: Prisma.FolderSelect }>);
    }
  };

  const root = await getOrCreateRootFolder(userWhere, select);
  segments.push(root as Prisma.FolderGetPayload<{ select: Prisma.FolderSelect }>);
  return segments.reverse();
}
