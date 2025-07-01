import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";


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