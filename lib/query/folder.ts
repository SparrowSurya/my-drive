import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { type FileTree } from "@/lib/types/file";
import { detectMimeTypeFromBuffer } from "../mime/detection";
import FileQuery from "./file";


/** Singleton query interface for prisma queries for folder(s). */
export default class FolderQuery {

  /** Create folder. */
  static async create<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    parent: Prisma.FolderWhereUniqueInput,
    values: Omit<Prisma.FolderCreateInput, "user" | "isRoot">,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    const result = await prisma.folder.create({
      data: {
        ...values,
        parent: {
          create: {
            parent: { connect: parent },
          },
        },
        user: { connect: user },
      },
      select,
    });
    // TODO: activity
    return result;
  }

  /** Provides root folder. Creates a new one if root not exists. */
  static async readRoot<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    const root = await prisma.folder.findFirst({
      where: { user, name: "", isRoot: true },
      select,
    });

    if (root) return root;

    return await prisma.folder.create({
      data: {
        user: { connect: user },
        name: "",
        isRoot: true,
      },
      select,
    })
  }

  /** Read specific folder. */
  static async read<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    return await prisma.folder.findFirstOrThrow({
      where: { ...folder, user },
      select,
    });
  }

  /** Read specific folder safely. */
  static async readSafe<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }> | null> {
    return await prisma.folder.findFirst({
      where: { ...folder, user },
      select,
    });
  }

  /** Read multiple folders. */
  static async readMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.FolderOrderByWithRelationInput | Prisma.FolderOrderByWithRelationInput[],
    } | undefined>,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    return await prisma.folder.findMany({
      where: { ...folder, user },
      select,
      ...options,
    });
  }

  /** Read child folders inside parent. */
  static async readChildFolders<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    parent: Prisma.FolderWhereInput,
    folder: Prisma.FolderWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.FolderOrderByWithRelationInput | Prisma.FolderOrderByWithRelationInput[],
    } | undefined>,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    return await prisma.folder.findMany({
      where: {
        ...folder,
        parent: {
          parent: { ...parent, user },
        },
      },
      select,
      ...options,
    });
  }

  /** Read child files inside parent. */
  static async readChildFiles<S extends Prisma.FileSelect>(
    user: Prisma.UserWhereUniqueInput,
    parent: Prisma.FolderWhereInput,
    file: Prisma.FileWhereInput,
    select: S,
    options?: Readonly<{
      take?: number,
      skip?: number,
      orderBy?: Prisma.FileOrderByWithRelationInput | Prisma.FileOrderByWithRelationInput[],
    }>,
  ): Promise<Prisma.FileGetPayload<{ select: S }>[]> {
    return await FileQuery.readMany(user, parent, file, select, options);
  }

  /** Read child content for zipping. */
  static async readChildContents(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereUniqueInput,
    select: Prisma.FileSelect,
  ): Promise<Array<Prisma.FileGetPayload<{ select: Prisma.FileSelect }> & { filepath: string }>> {
    const parent = await prisma.folder.findUniqueOrThrow({
      where: { ...folder, user },
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

  /** Recursively read descendant files and folders. */
  static async readChildrenRecursive<
    FileSelect extends Prisma.FileSelect,
    FolderSelect extends Prisma.FolderSelect,
  >(
    user: Prisma.UserWhereUniqueInput,
    parents: Prisma.FolderWhereUniqueInput[],
    fileSelect: FileSelect,
    folderSelect: FolderSelect,
  ): Promise<{
    files: Prisma.FileGetPayload<{ select: FileSelect }>[],
    folders: Prisma.FolderGetPayload<{ select: FolderSelect }>[],
  }> {
    const parentIds = parents.map((p) => p.id).filter((id): id is number => id !== undefined);
    const stack = [...parentIds];
    const visited = new Set(parentIds);

    const folderIds: number[] = [];
    const fileIds: number[] = [];

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      const [folders, files] = await Promise.all([
        this.readChildFolders(user, { id: currentId }, {}, { id: true }),
        this.readChildFiles(user, { id: currentId }, {}, { id: true }),
      ]);

      const fIds = folders.map((f) => f.id).filter(id => !visited.has(id));
      for (const id of fIds) visited.add(id);

      folderIds.push(...fIds);
      fileIds.push(...files.map((f) => f.id));
      stack.push(...fIds);
    }

    const [finalFolders, finalFiles] = await Promise.all([
      folderIds.length > 0
        ? this.readMany(user, { id: { in: folderIds } }, folderSelect)
        : [],
      fileIds.length > 0
        ? FileQuery.readMany(user, {}, { id: { in: fileIds } }, fileSelect)
        : []
    ]);

    return {
      folders: finalFolders,
      files: finalFiles,
    };
  }

  /** Update folder. */
  static async update<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    values: Omit<Prisma.FolderUpdateInput, "isRoot">,
    select: S,
    // TODO: activity actions
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    const result = await prisma.folder.update({
      where: { ...where, user },
      data: values,
      select,
    });
    // TODO: update activity
    return result;
  }

  /** Update multiple folder. */
  static async updateMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereInput,
    values: Omit<Prisma.FolderUncheckedUpdateInput, "isRoot">,
    select: S,
    // TODO: activity actions
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    const result = await prisma.folder.updateManyAndReturn({
      where: { ...where, user },
      data: values,
      select,
    });
    // TODO: update activity
    return result;
  }

  /** Rename specific folder. */
  static async rename<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    name: string,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    return await this.update(user, where, { name }, select);
  }

  /** Star specific folder. */
  static async star<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    return await this.update(user, where, { starred: true }, select);
  }

  /** Star multiple folder. */
  static async starMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    return await this.updateMany(user, where, { starred: true }, select);
  }

  /** Unstar specific folder. */
  static async unstar<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    return await this.update(user, where, { starred: false }, select);
  }

  /** Unstar multiple folder. */
  static async unstarMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    return await this.updateMany(user, where, { starred: false }, select);
  }

  /** Move specific folder. */
  static async move<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    folder: Prisma.FolderWhereUniqueInput,
    parent: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    const target = await this.read(user, folder, { id: true });

    const result = await prisma.hierarchy.update({
      where: { folderId: target.id },
      data: {
        parent: { connect: parent },
      },
      select: {
        folder: { select }
      }
    });
    // TODO: activity
    return result.folder;
  }

  /** Move multiple folders. */
  static async moveMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereInput,
    parent: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    const targetParent = await this.read(user, parent, { id: true });

    const foldersToMove = await prisma.folder.findMany({
      where: { ...where, user },
      select: { id: true }
    });
    const ids = foldersToMove.map((f) => f.id);

    const result = await prisma.hierarchy.updateManyAndReturn({
      where: { folderId: { in: ids } },
      data: { parentId: targetParent.id },
      select: {
        folder: { select }
      }
    });
    // TODO: activity
    return result.map((f) => f.folder as Prisma.FolderGetPayload<{ select: S }>);
  }

  /** Move specific folder to trash. */
  static async trash<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    const target = await this.read(user, where, { id: true });
    const now = new Date();

    const data = { deletedAt: now, directDelete: false };
    const { folders, files } = await this.readChildrenRecursive(user, [target], { id: true }, { id: true });
    const folderIds = folders.map((f) => f.id);
    const fileIds = files.map((f) => f.id);

    await this.update(user, { id: target.id }, { ...data, directDelete: true }, { id: true });
    if (folderIds.length > 0) {
      await this.updateMany(user, { id: { in: folderIds } }, data, { id: true });
    }
    if (fileIds.length > 0) {
      await FileQuery.updateMany(user, { id: { in: fileIds } }, data, { id: true });
    }

    return await prisma.folder.findUniqueOrThrow({
      where: { id: target.id },
      select,
    });
  }

  /** Move multiple folders to trash. */
  static async trashMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    const targets = await this.readMany(user, where, { id: true });
    const targetIds = targets.map((t) => t.id);
    const now = new Date();

    const data = { deletedAt: now, directDelete: false };
    const { folders, files } = await this.readChildrenRecursive(user, targets, { id: true }, { id: true });
    const folderIds = folders.map((f) => f.id);
    const fileIds = files.map((f) => f.id);

    if (targetIds.length > 0) {
      await this.updateMany(user, { id: { in: targetIds } }, { ...data, directDelete: true }, { id: true });
    }
    if (folderIds.length > 0) {
      await this.updateMany(user, { id: { in: folderIds } }, data, { id: true });
    }
    if (fileIds.length > 0) {
      await FileQuery.updateMany(user, { id: { in: fileIds } }, data, { id: true });
    }

    return await prisma.folder.findMany({
      where: { id: { in: targetIds } },
      select,
    });
  }

  /** Restore specific folder from trash. */
  static async restore<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereUniqueInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>> {
    const target = await this.read(user, where, { id: true });

    const { folders, files } = await this.readChildrenRecursive(user, [target], { id: true }, { id: true });
    const folderIds = folders.map((f) => f.id);
    const fileIds = files.map((f) => f.id);

    const data = { deletedAt: null, directDelete: null };

    await this.update(user, { id: target.id }, data, { id: true });
    if (folderIds.length > 0) {
      await this.updateMany(user, { id: { in: folderIds }, directDelete: false }, data, { id: true });
    }
    if (fileIds.length > 0) {
      await FileQuery.updateMany(user, { id: { in: fileIds }, directDelete: false }, data, { id: true });
    }

    return await prisma.folder.findUniqueOrThrow({
      where: { id: target.id },
      select,
    });
  }

  /** Restore multiple folders from trash. */
  static async restoreMany<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    where: Prisma.FolderWhereInput,
    select: S,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    const targets = await this.readMany(user, where, { id: true });
    const targetIds = targets.map((t) => t.id);

    const { folders, files } = await this.readChildrenRecursive(user, targets, { id: true }, { id: true });
    const folderIds = folders.map((f) => f.id);
    const fileIds = files.map((f) => f.id);

    const data = { deletedAt: null, directDelete: null };

    if (targetIds.length > 0) {
      await this.updateMany(user, { id: { in: targetIds } }, data, { id: true });
    }
    if (folderIds.length > 0) {
      await this.updateMany(user, { id: { in: folderIds }, directDelete: false }, data, { id: true });
    }
    if (fileIds.length > 0) {
      await FileQuery.updateMany(user, { id: { in: fileIds }, directDelete: false }, data, { id: true });
    }

    return await prisma.folder.findMany({
      where: { id: { in: targetIds } },
      select,
    });
  }

  static async readHierarchy<S extends Prisma.FolderSelect>(
    user: Prisma.UserWhereUniqueInput,
    child: Prisma.FolderWhereUniqueInput,
    select: S,
    deleted: boolean = false,
  ): Promise<Prisma.FolderGetPayload<{ select: S }>[]> {
    const extra = deleted ? { deletedAt: { not: null } } : { deletedAt: null };
    const where = { ...child, user, ...extra };

    const folder = await this.read(user, where, { id: true });

    let id: number | undefined = folder.id;
    const segments: Prisma.FolderGetPayload<{ select: S }>[] = [];

    type SelectExtra = {
      isRoot: boolean,
      parent: { parentId: number | null } | null,
      directDelete: boolean | null,
    };

    while (id) {
      const folder = await prisma.folder.findUniqueOrThrow({
        where: { id },
        select: {
          ...select,
          parent: { select: { parentId: true } },
          id: true,
          isRoot: true,
          directDelete: true,
        } as Prisma.FolderSelect,
      }) as Prisma.FolderGetPayload<{ select: S }> & SelectExtra;

      segments.push(folder);

      const isRoot = folder.isRoot || !(folder.parent?.parentId);
      const isDirectDelete = deleted && folder.directDelete;
      if (isRoot || isDirectDelete) {
        if (!isDirectDelete) segments.pop();
        break;
      }

      id = folder.parent?.parentId || undefined;
    }

    return segments.reverse();
  }

  static async createTree(
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
}