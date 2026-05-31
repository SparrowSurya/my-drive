"use server";

import { getServerSession } from "next-auth";
import FolderQuery from "@/lib/query/folder";
import FileQuery from "@/lib/query/file";
import type { ContentData } from "@/components/content/types";
import utils from "@/lib/utils";


export async function getFolderContents(id: number, deleted: boolean): Promise<ContentData[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [];

  const select = { id: true, name: true, updatedAt: true, starred: true };
  const fileSelect = {
    ...select,
    size: true,
    folderId: true,
    mimeType: true,
    deletedAt: false,
    folder: {
      select: {
        id: false,
        name: false,
        user: {
          select: { name: true, email: true },
        }
      },
    }
  };
  const folderSelect = {
    ...select,
    parent: {
      select: {
        parent: {
          select: { id: true, name: true },
        },
      },
    },
    user: {
      select: { name: true, email: true },
    },
  }

  const fileWhere = deleted ? {} : { deletedAt: null };
  const folderWhere = deleted ? {} : { deletedAt: null };

  const [files, folders] = await Promise.all([
    FileQuery.readMany({ email }, { id }, fileWhere, fileSelect),
    FolderQuery.readChildFolders({ email }, { id }, folderWhere, folderSelect),
  ]);

  const contents = [
    ...folders.map(f => utils.map2FolderData(email, f)),
    ...files.map(f => utils.map2FileData(email, f)),
  ] as ContentData[];

  contents.forEach((f) => f.reason = undefined);
  return contents;
}

export async function getPathSegments(id: number, deleted: boolean): Promise<{ id: number, name: string }[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [];

  const select = { id: true, name: true };
  return await FolderQuery.readHierarchy({ email }, { id }, select, deleted);
}

export async function getFolderName(id: number): Promise<{ name: string }> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return { name: "" };

  const select = { name: true };
  try {
    return await FolderQuery.read({ email }, { id }, select);
  } catch {
    return { name: "" };
  }
}

export async function folderDeletionStatus(id: number): Promise<{ deleted: boolean, direct: boolean }> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return { deleted: false, direct: false };

  const select = { deletedAt: true, directDelete: true };

  try {
    const folder = await FolderQuery.read({ email }, { id }, select);
    return {
      deleted: folder.deletedAt instanceof Date,
      direct: folder.directDelete ?? false,
    };
  } catch {}

  return { deleted: false, direct: false };
}
