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

  const createdFiles = await Promise.all(
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

  return createdFiles;
}
