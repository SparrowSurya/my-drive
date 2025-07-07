import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { type FileTree } from "@/lib/types/file";


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

export async function getFolders(
  userWhere: Prisma.UserWhereUniqueInput,
  parentWhere: Prisma.FolderWhereUniqueInput,
  select: Prisma.FolderSelect,
): Promise<Prisma.FolderGetPayload<{ select: Prisma.FolderSelect }>[]> {
  const children = await prisma.hierarchy.findMany({
    where: {
      parent: {
        is: { ...parentWhere, user: userWhere },
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
        parent: { select: { parentId: true }},
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
): Promise<Prisma.FolderGetPayload<{ select?: Prisma.FolderSelect }>> {
  return await prisma.folder.findUniqueOrThrow({
    where: {
      user: userWhere,
      ...folderWhere,
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
      where: { folderId: parentId },
      select: { ...select, name: true },
    });

    for (const file of foundFiles) {
      files.push({ ...file, filepath: `${segment}/${file.name}` });
    }

    const folders = await prisma.hierarchy.findMany({
      where: { parentId },
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
