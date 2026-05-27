import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { type FileTree } from "@/lib/types/file";
import { detectMimeTypeFromBuffer } from "../mime/detection";


export async function getOrCreateRootFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  select?: Prisma.FolderSelect,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  const user = await prisma.user.findUniqueOrThrow({
    where: userWhere,
    select: { id: true },
  });

  const root = await prisma.folder.findFirst({
    where: { userId: user.id, name: "", isRoot: true },
    select,
  });

  if (root) return root;

  return prisma.folder.create({
    data: {
      userId: user.id,
      name: "",
      isRoot: true,
    },
    select,
  });
}

export async function getFolders<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  parentWhere: Prisma.FolderWhereUniqueInput,
  select: T,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  const children = await prisma.hierarchy.findMany({
    where: {
      parent: {
        is: { ...parentWhere, user: userWhere },
      },
      folder: {
        deletedAt: null,
      },
    },
    select: {
      folder: { select },
    },
  });

  return children.map(child => child.folder);
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
  folderValues: Omit<Prisma.FolderCreateInput, "user" | "isRoot">,
  select?: Prisma.FolderSelect,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  return await prisma.folder.create({
    data: {
      user: { connect: userWhere },
      parent: {
        create: {
          parent: { connect: parentWhere },
        },
      },
      ...folderValues,
    },
    select,
  });
}


// TODO - use transaction to handle failure
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

  type StackItem = {
    parentId: number,
    subtree: FileTree<Omit<Prisma.FileCreateInput, "folder">>,
  };

  const stack: StackItem[] = [
    { parentId: parent.id, subtree: tree },
  ];

  while (stack.length > 0) {
    const { parentId, subtree } = stack.pop()!;

    for (const [name, value] of Object.entries(subtree)) {
      if (Array.isArray(value)) {
        for (const file of value) {
          const existingFile = await prisma.file.findUnique({
            where: { name_folderId: { folderId: parentId, name: file.name }, deletedAt: null },
            select: { id: true },
          });
          if (existingFile) continue;

          const mimeResult = detectMimeTypeFromBuffer(file.data);
          await prisma.file.create({
            data: {
              ...file,
              mimeType: mimeResult.mimeType,
              folder: { connect: { id: parentId } },
            },
          });
        }
      } else {
        const existingFolder = await prisma.folder.findFirst({
          where: {
            name,
            userId: user.id,
            parent: { is: { parentId } },
          },
          select: { id: true },
        });
        if (existingFolder) {
          stack.push({ parentId: existingFolder.id, subtree: value });
        } else {
          const newFolder = await prisma.folder.create({
            data: {
              name,
              parent: {
                create: { parentId },
              },
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

export async function getParentHierarchy(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereUniqueInput,
  select?: Prisma.FolderSelect,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>[]> {
  const folder = await prisma.folder.findUniqueOrThrow({
    where: {
      user: userWhere,
      ...folderWhere,
    },
    select: { id: true, isRoot: true },
  });

  const segments: Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>[] = [];
  let id = folder.id;

  while (true) {
    const folder = await prisma.folder.findUniqueOrThrow({
      where: { id },
      select: {
        ...(select ?? {}),
        parent: { select: { parentId: true } },
        id: true,
        isRoot: true,
      },
    });

    // FIXME - This may add extra fields due to above select
    segments.push(folder as Prisma.FolderGetPayload<{ select: Prisma.FolderSelect }>);

    if (folder.isRoot || !(folder.parent?.parentId)) break;
    id = folder.parent?.parentId;
  };

  return segments.reverse();
}

export async function getFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereUniqueInput,
  select?: Prisma.FolderSelect,
  deleted?: boolean,
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  return await prisma.folder.findFirstOrThrow({
    where: {
      user: userWhere,
      ...folderWhere,
      ...(deleted ? {} : { deletedAt: null })
    },
    select,
  });
}

export async function getFolderContents(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereUniqueInput,
  select: Prisma.FileSelect,
): Promise<Array<Prisma.FileGetPayload<{ select: Prisma.FileSelect }> & { filepath: string }>> {
  const parent = await prisma.folder.findUniqueOrThrow({
    where: {
      ...folderWhere,
      user: userWhere,
    },
    select: { id: true, name: true },
  });

  type StackItem = {
    folderId: number,
    folderName: string,
  };

  const files: Array<Prisma.FileGetPayload<{ select: Prisma.FileSelect }> & { filepath: string }> = [];
  const stack: StackItem[] = [{ folderId: parent.id, folderName: parent.name }];

  while (stack.length > 0) {
    const { folderId: parentId, folderName: segment } = stack.pop()!;

    const foundFiles = await prisma.file.findMany({
      where: { folderId: parentId, deletedAt: null },
      select: { ...select, name: true },
    });

    for (const file of foundFiles) {
      files.push({ ...file, filepath: `${segment}/${file.name}` });
    }

    const folders = await prisma.hierarchy.findMany({
      where: {
        parentId,
        folder: { deletedAt: null },
      },
      select: {
        folderId: true,
        folder: { select: { name: true } },
      },
    });

    for (const { folderId, folder } of folders) {
      stack.push({
        folderId: folderId,
        folderName: `${segment}/${folder.name}`,
      });
    }
  }

  return files;
}

export async function getRecentFolders<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
  take?: number,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  return await prisma.folder.findMany({
    where: { user: userWhere, deletedAt: null },
    orderBy: { createdAt: "desc" },
    select,
    take,
  });
}

export async function getChildren<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
  folderId?: number | null,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  const id = !!folderId ? folderId : (await getOrCreateRootFolder(userWhere, { id: true })).id;
  return (await prisma.hierarchy.findMany({
    where: {
      parentId: id,
      folder: {
        user: userWhere,
        deletedAt: null,
      },
    },
    orderBy: {
      folder: { updatedAt: "desc" },
    },
    select: {
      folder: { select },
    },
  })).map((f) => f.folder);
}

export async function moveFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
  targetFolderId: number,
): Promise<void> {
  await prisma.hierarchy.update({
    where: {
      folderId,
      folder: { user: userWhere },
    },
    data: {
      parentId: targetFolderId,
    },
  });
}

export async function softDeleteFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
): Promise<Prisma.FolderGetPayload<{ select: { name: true } }>> {
  const now = new Date();

  const folder = await prisma.folder.update({
    where: { id: folderId, user: userWhere },
    data: { deletedAt: now, directDelete: true },
    select: { name: true },
  });

  const stack = [folderId];
  while (stack.length > 0) {
    const currentId = stack.pop()!;

    await prisma.file.updateMany({
      where: { folderId: currentId, deletedAt: null },
      data: { deletedAt: now, directDelete: false },
    });

    const children = await prisma.hierarchy.findMany({
      where: { parentId: currentId },
      select: { folderId: true },
    });

    for (const child of children) {
      const updatedChild = await prisma.folder.updateMany({
        where: { id: child.folderId, deletedAt: null },
        data: { deletedAt: now, directDelete: false },
      });

      if (updatedChild.count > 0) {
        stack.push(child.folderId);
      }
    }
  }

  return folder;
}

export async function restoreFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
): Promise<void> {
  await prisma.folder.update({
    where: { id: folderId, user: userWhere },
    data: { deletedAt: null, directDelete: null },
  });

  const stack = [folderId];
  while (stack.length > 0) {
    const currentId = stack.pop()!;

    await prisma.file.updateMany({
      where: { folderId: currentId, directDelete: false },
      data: { deletedAt: null, directDelete: null },
    });

    const children = await prisma.hierarchy.findMany({
      where: { parentId: currentId },
      select: { folderId: true },
    });

    for (const child of children) {
      const updatedChild = await prisma.folder.updateMany({
        where: { id: child.folderId, directDelete: false },
        data: { deletedAt: null, directDelete: null },
      });

      if (updatedChild.count > 0) {
        stack.push(child.folderId);
      }
    }
  }
}

export async function starFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
): Promise<Prisma.FolderGetPayload<{ select: { name: true } }>> {
  return await updateFolder(userWhere, { id: folderId }, { starred: true }, { name: true });
}

export async function unstarFolder(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
): Promise<Prisma.FolderGetPayload<{ select: { name: true } }>> {
  return await updateFolder(userWhere, { id: folderId }, { starred: false }, { name: true });
}

export async function getDirectStarredFolders<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  return await prisma.folder.findMany({
    where: {
      user: userWhere,
      deletedAt: null,
      starred: true,
    },
    select,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getDirectDeletedFolders<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  return await prisma.folder.findMany({
    where: {
      user: userWhere,
      deletedAt: { not: null },
      directDelete: true,
    },
    select,
    orderBy: {
      deletedAt: "desc",
    },
  });
}

export async function isFolderDeleted(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
): Promise<[boolean, boolean]> {
  const folder = await prisma.folder.findUnique({
    where: {
      user: userWhere,
      id: folderId,
      deletedAt: { not: null },
    },
    select: {
      id: true,
      directDelete: true,
    },
  });
  return (folder === null) ? [false, false] : [true, folder.directDelete ?? false];
}

export async function getDeletedChildFolders<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
  select: T,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  const children = await prisma.hierarchy.findMany({
    where: {
      parent: {
        user: userWhere,
        id: folderId,
        deletedAt: { not: null },
      },
    },
    select: {
      folder: { select },
    },
  });
  return children.map((c) => c.folder);
}

export async function getDeletedParentHierarchy<T extends Prisma.FolderSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
  select: T,
): Promise<Prisma.FolderGetPayload<{ select: T }>[]> {
  const folder = await prisma.folder.findUniqueOrThrow({
    where: {
      user: userWhere,
      id: folderId,
      deletedAt: { not: null },
    },
    select: { id: true, isRoot: true },
  });

  const segments: Prisma.FolderGetPayload<{ select: T }>[] = [];
  let id = folder.id;

  type extra = {
    isRoot: boolean,
    parent: { parentId: number | null } | null,
    directDelete: boolean | null,
  };

  while (!!id) {
    const folder = await prisma.folder.findUniqueOrThrow({
      where: { id },
      select: {
        ...select,
        parent: { select: { parentId: true } },
        id: true,
        isRoot: true,
        deletedAt: true,
        directDelete: true,
      } as Prisma.FolderGetPayload<{ select: T & extra }>,
    }) as Prisma.FolderGetPayload<{ select: T }> & extra;

    // FIXME - This may add extra fields due to above select
    segments.push(folder);

    if (folder.isRoot || !(folder.parent?.parentId) || folder.directDelete === true) break;
    id = folder.parent?.parentId;
  }

  return segments.reverse();
}
