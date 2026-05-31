import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import FolderQuery from "./folder";
import { detectMimeTypeFromBuffer } from "../mime/detection";


export type FileUploadData = {
  name: string,
  path: string[],
  folderId: number,
  data: Uint8Array,
};


/** Singleton query interface for prisma queries for file(s). */
export default class FileQuery {

  /** Upload a single file. */
  static async upload<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereUniqueInput,
    file: Omit<Prisma.FileCreateInput, "folder">,
    select?: S,
  ): Promise<Prisma.FileGetPayload<{ select?: S }>> {
    const mimeType = file.mimeType ?? detectMimeTypeFromBuffer(file.data).mimeType;
    const data = {
      name: file.name,
      size: file.size,
      data: file.data,
      mimeType,
      folder: {
        connect: { ...folder, user },
      },
    };

    const result = await prisma.file.create({ data, select });
    // TODO: activity
    return result;
  }

  /** Upload multiple files. */
  static async uploadMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    files: Readonly<{
      folderId: number,
      file: Omit<Prisma.FileCreateInput, "folder">,
    }[]>,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    const owner = await prisma.user.findUniqueOrThrow({ where: user, select: { id: true } });

    const data = files.map(({file, folderId}) => ({
      name: file.name,
      size: file.size,
      data: file.data,
      mimeType: file.mimeType ?? detectMimeTypeFromBuffer(file.data).mimeType,
      folderId,
      folder: {
        connect: { id: folderId, userId: owner.id },
      }
    }));

    const result = await prisma.file.createManyAndReturn({ data, select });
    // TODO: activity
    return result;
  }

  /** Read specific file. */
  static async read<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    const result = await prisma.file.findUniqueOrThrow({
      where: {
        ...where,
        folder: { user },
      },
      select,
    });
    // TODO: activity
    return result;
  }

  /** Read multiple files. */
  static async readMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereInput,
    where: Prisma.FileWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.FileOrderByWithRelationInput | Prisma.FileOrderByWithRelationInput[],
    } | undefined>,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    const result = await prisma.file.findMany({
      where: {
        ...where,
        folder: { ...folder, user },
      },
      select,
      ...options,
    });
    // TODO: activity
    return result;
  }

  /** Total storage used by user. */
  static async readStorageUsed(
    user: Prisma.UserWhereUniqueInput,
  ): Promise<number> {
    const result = await prisma.file.aggregate({
      where: { folder: { user } },
      _sum: { size: true },
    });
    return result._sum.size ?? 0;
  }

  /** Update specific file. */
  static async update<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    values: Prisma.FileUpdateInput,
    select: S,
    // TODO: activities action list
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    const result = await prisma.file.update({
      where: {
        ...where,
        folder: { user },
      },
      data: values,
      select,
    });
    // TODO: activity
    return result;
  }

  /** Update multiple files. */
  static async updateMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereInput,
    values: Prisma.FileUncheckedUpdateInput,
    select: S,
    // TODO: activities action list
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    const result = await prisma.file.updateManyAndReturn({
      where: {
        ...where,
        folder: { user },
      },
      data: values,
      select,
    });
    // TODO: activity
    return result;
  }

  /** Rename specific file. */
  static async rename<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    name: string,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    return await this.update(user, where, { name }, select);
  }

  /** Star specific file. */
  static async star<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    return await this.update(user, where, { starred: true }, select);
  }

  /** Star multiple files. */
  static async starMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    return await this.updateMany(user, where, { starred: true }, select);
  }

  /** Unstar specific file. */
  static async unstar<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    return await this.update(user, where, { starred: false }, select);
  }

  /** Unstar multiple files. */
  static async unstarMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    return await this.updateMany(user, where, { starred: false }, select);
  }

  /** Move specific file. */
  static async move<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    folder: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    const data = { folder: { connect: folder }, };
    return await this.update(user, where, data, select);
  }

  /** Move multiple files. */
  static async moveMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereInput,
    folder: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    const targetFolder = await prisma.folder.findFirstOrThrow({
      where: { ...folder, user },
      select: { id: true }
    });

    return await this.updateMany(user, where, { folderId: targetFolder.id }, select);
  }

  /** Move file to trash */
  static async trash<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    const data = { deletedAt: new Date(), directDelete: true };
    return await this.update(user, where, data, select);
  }

  /** Move files to trash */
  static async trashMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    const data = { deletedAt: new Date(), directDelete: true };
    return await this.updateMany(user, where, data, select);
  }

  /** Restore file from trash */
  static async restore<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    const data = { deletedAt: null, directDelete: false };
    return await this.update(user, where, data, select);
  }

  /** Restore files from trash */
  static async restoreMany<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FileWhereInput,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    const data = { deletedAt: null, directDelete: false };
    return await this.updateMany(user, where, data, select);
  }

  /** Upload a file in specific tree from parent. */
  static async uploadPath<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    file: FileUploadData,
    select: S,
  ): Promise<Prisma.FileGetPayload<{ select: S }>> {
    let folderId = file.folderId;
    let isParentDeleted = false;

    if (folderId === 0) {
      const root = await FolderQuery.readRoot(user, { id: true, deletedAt: true });
      folderId = root.id;
    } else {
      const folder = await FolderQuery.read(user, { id: folderId }, { deletedAt: true });
      isParentDeleted = folder.deletedAt !== null;
    }

    const deletedArgs = isParentDeleted ? {
      deletedAt: new Date(),
      directDelete: false,
    } : {};

    // HACK: Running this maximum 3 times to ensure we did our best.
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
                  user: { connect: user },
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
}
