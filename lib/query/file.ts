import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { getOrCreateRootFolder } from "./folder";


export async function addFiles(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereUniqueInput,
  files: Omit<Prisma.FileCreateInput, "folder">[],
  select?: Prisma.FileSelect,
): Promise<Prisma.FileGetPayload<{ select?: Prisma.FileSelect }>[]> {
  const user = await prisma.user.findUniqueOrThrow({
    where: userWhere,
    select: { id: true },
  });

  const folder = await prisma.folder.findUniqueOrThrow({
    where: {
      userId: user.id,
      ...folderWhere,
    },
    select: { id: true },
  });

  return await Promise.all(
    files.map(file =>
      prisma.file.create({
        data: {
          ...file,
          folder: { connect: { id: folder.id } },
        },
        select,
      })
    )
  );
}

export async function getFiles(
  userWhere: Prisma.UserWhereUniqueInput,
  folderWhere: Prisma.FolderWhereInput,
  fileWhere?: Prisma.FileWhereInput | undefined,
  select?: Prisma.FileSelect | undefined,
): Promise<Prisma.FileGetPayload<{ select?: Prisma.FileSelect }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: {
        user: userWhere,
        ...folderWhere,
      },
      ...(fileWhere ?? {}),
    },
    select,
  });
}

export async function updateFile(
  userWhere: Prisma.UserWhereUniqueInput,
  fileWhere: Prisma.FileWhereUniqueInput,
  values: Prisma.FileUpdateInput,
  select?: Prisma.FileSelect,
): Promise<Prisma.FileGetPayload<{ select?: Prisma.FileSelect }>> {
  return await prisma.file.update({
    where: {
      folder: {
        user: userWhere,
      },
      ...fileWhere,
    },
    data: values,
    select,
  })
}

export async function getStorageUsed(
  userWhere: Prisma.UserWhereUniqueInput,
): Promise<number> {
  const result = await prisma.file.aggregate({
    where: {
      folder: { user: userWhere },
    },
    _sum: { size: true }
  });
  return result._sum.size ?? 0;
}


export type FileUploadData = {
  name: string,
  path: string[],
  folderId: number,
  data: Uint8Array,
};

export async function addFileWithRelativePath(
  userWhere: Prisma.UserWhereUniqueInput,
  file: FileUploadData,
  select?: Prisma.FileSelect,
): Promise<Prisma.FileGetPayload<{ select?: Prisma.FileSelect }>> {
  let folderId = file.folderId;
  if (folderId === 0) {
    const root = await getOrCreateRootFolder(userWhere, { id: true });
    folderId = root.id;
  }

  for (const folderName of file.path) {
    const childFolder = await prisma.hierarchy.findFirst({
      where: {
        parentId: folderId,
        folder: { name: folderName }
      },
      select: { folderId: true },
    });

    if (childFolder) {
      folderId = childFolder.folderId
    } else {
      const newFolder = await prisma.folder.create({
        data: {
          user: { connect: userWhere },
          name: folderName,
          parent: { create: { parentId: folderId } },
        }
      })
      folderId = newFolder.id;
    }
  }

  const existingFile = await prisma.file.findUnique({
    where: { name_folderId: { name: file.name, folderId }}
  });
  if (existingFile) throw new Error("file already exists");

  return await prisma.file.create({
    data: {
      folderId,
      name: file.name,
      size: file.data.length,
      data: file.data,
    },
    select,
  });
}