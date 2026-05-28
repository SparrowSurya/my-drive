import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { getOrCreateRootFolder, isFolderDeleted } from "./folder";
import { detectMimeTypeFromBuffer } from "../mime/detection";


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
          mimeType: detectMimeTypeFromBuffer(file.data).mimeType,
          folder: { connect: { id: folder.id } },
        },
        select,
      })
    )
  );
}

export async function getFiles<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
  folderWhere: Prisma.FolderWhereInput,
  fileWhere?: Prisma.FileWhereInput | undefined,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: {
        user: userWhere,
        ...folderWhere,
      },
      ...(fileWhere ?? {}),
      deletedAt: null,
    },
    select,
  });
}

export async function updateFile<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  fileWhere: Prisma.FileWhereUniqueInput,
  values: Prisma.FileUpdateInput,
  select: T,
): Promise<Prisma.FileGetPayload<{ select: T }>> {
  return await prisma.file.update({
    where: {
      folder: {
        user: userWhere,
      },
      deletedAt: null,
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
  let isParentDeleted = false;

  if (folderId === 0) {
    const root = await getOrCreateRootFolder(userWhere, { id: true, deletedAt: true });
    folderId = root.id;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isDeleted, directDelete] = await isFolderDeleted(userWhere, folderId);
    isParentDeleted = isDeleted;
  }

  const deletedArgs = isParentDeleted ? {
    deletedAt: new Date(),
    directDelete: false,
  } : {};

  // HACK: Try to run this atmost 3 times to make sure we did our best
  for (let i=0; i<3; i++) {
    try {
      await prisma.$transaction(async (tx) => {
        for (const folderName of file.path) {
          const childFolder = await tx.hierarchy.findFirst({
            where: {
              parentId: folderId,
              folder: { name: folderName }
            },
            select: { folderId: true },
          });

          if (childFolder) {
            folderId = childFolder.folderId
          } else {
            const newFolder = await tx.folder.create({
              data: {
                user: { connect: userWhere },
                name: folderName,
                parent: { create: { parentId: folderId } },
                ...deletedArgs,
              }
            })
            folderId = newFolder.id;
          }
        }
      });
    } catch {
      continue;
    }
    break;
  }

  const existingFile = await prisma.file.findUnique({
    where: { name_folderId: { name: file.name, folderId } }
  });
  if (existingFile) throw new Error("file already exists");

  return await prisma.file.create({
    data: {
      folderId,
      name: file.name,
      size: file.data.length,
      mimeType: detectMimeTypeFromBuffer(file.data).mimeType,
      data: new Uint8Array(file.data),
      ...deletedArgs,
    },
    select,
  });
}

export async function getFile<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  fileWhere: Prisma.FileWhereUniqueInput,
  select: T,
  deleted: boolean = false,
): Promise<Prisma.FileGetPayload<{ select: T }>> {
  return await prisma.file.findFirstOrThrow({
    where: {
      folder: { user: userWhere },
      ...fileWhere,
      ...(deleted ? {} : { deletedAt: null }),
    },
    select,
  });
}

export async function getRecentFiles<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
  take?: number,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: { user: userWhere },
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc"
    },
    select,
    take,
  });
}

export async function softDeleteFile<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  fileWhere: Prisma.FileWhereUniqueInput,
  select: T,
): Promise<Prisma.FileGetPayload<{ select: T }>> {
  const data = { deletedAt: new Date(), directDelete: true };
  return await updateFile(userWhere, fileWhere, data, select);
}

export async function getDirectDeletedFiles<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
  folderWhere?: Prisma.FolderWhereUniqueInput,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: {
        ...folderWhere,
        user: userWhere,
      },
      deletedAt: { not: null },
      directDelete: true,
    },
    select,
    orderBy: {
      deletedAt: "desc",
    },
  });
}

export async function moveFile(
  userWhere: Prisma.UserWhereUniqueInput,
  fileId: number,
  folderId: number,
): Promise<void> {
  const data = { folder: { connect: { id: folderId } } };
  await updateFile(userWhere, { id: fileId }, data, { id: true });
}

export async function restoreFile(
  userWhere: Prisma.UserWhereUniqueInput,
  fileId: number,
): Promise<void> {
  const data = { deletedAt: null, directDelete: null };
  const fileWhere = { id: fileId, deletedAt: { not: null } };
  await updateFile(userWhere, fileWhere, data, { id: true });
}

export async function starFile(
  userWhere: Prisma.UserWhereUniqueInput,
  fileId: number,
): Promise<Prisma.FileGetPayload<{ select: { name: true } }>> {
  return await updateFile(userWhere, { id: fileId }, { starred: true }, { name: true });
}

export async function unstarFile(
  userWhere: Prisma.UserWhereUniqueInput,
  fileId: number,
): Promise<Prisma.FileGetPayload<{ select: { name: true } }>> {
  return await updateFile(userWhere, { id: fileId }, { starred: false }, { name: true });
}

export async function getDirectStarredFiles<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: { user: userWhere },
      deletedAt: null,
      starred: true,
    },
    select,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getDeletedFiles<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  folderId: number,
  select: T,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: {
        user: userWhere,
        id: folderId,
      },
      deletedAt: { not: null },
    },
    select,
  });
}

export async function getFilesByUsage<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  select: T,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: { user: userWhere },
      deletedAt: null,
    },
    select,
    orderBy: {
      size: "desc",
    },
  });
}

export async function searchFile<T extends Prisma.FileSelect>(
  userWhere: Prisma.UserWhereUniqueInput,
  query: string,
  select: T,
): Promise<Prisma.FileGetPayload<{ select: T }>[]> {
  return await prisma.file.findMany({
    where: {
      folder: { user: userWhere },
      name: { contains: query },
      deletedAt: null,
    },
    orderBy: { updatedAt: "desc" },
    select,
  });
}