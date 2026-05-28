"use server";

import { getServerSession } from "next-auth";
import { getDeletedChildFolders, getDeletedParentHierarchy, getFolder, getFolders, getParentHierarchy, isFolderDeleted } from "@/lib/query/folder";
import { getDeletedFiles, getFiles } from "@/lib/query/file";
import type { ContentData } from "@/components/content/types";
import utils from "@/lib/utils";


export async function getFolderContents(id: number): Promise<ContentData[]> {
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
    parent: { select: { id: true } },
    user: { select: { name: true, email: true } },
  }

  const [files, folders] = await Promise.all([
    getFiles({ email }, fileSelect, { id }),
    getFolders({ email }, { id }, folderSelect),
  ]);

  const contents = [
    ...folders.map(f => utils.map2FolderData(email, f)),
    ...files.map(f => utils.map2FileData(email, f)),
  ] as ContentData[];

  contents.forEach((f) => f.reason = undefined);
  return contents;
}

export async function getPathSegments(id: number): Promise<{ id: number, name: string }[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [];

  const select = { id: true, name: true };
  return await getParentHierarchy({ email }, { id }, select);
}

export async function getFolderName(id: number): Promise<{ name: string }> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return { name: "" };

  const select = { name: true };
  try {
    return await getFolder({ email }, { id }, select, true);
  } catch {
    return { name: "" };
  }
}

export async function folderDeletionStatus(id: number): Promise<[boolean, boolean]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [false, false];

  try {
    return await isFolderDeleted({ email }, id);
  } catch {
    return [false, false];
  }
}

export async function getDeletedFolderContents(id: number): Promise<ContentData[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [];

  const select = { id: true, name: true, updatedAt: true };
  const fileSelect = {
    ...select,
    size: true,
    folderId: true,
    mimeType: true,
    deletedAt: true,
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
    parent: { select: { id: true } },
    user: { select: { name: true, email: true } },
  }

  try {
    const [files, folders] = await Promise.all([
      getDeletedFiles({ email }, id, fileSelect),
      getDeletedChildFolders({ email }, id, folderSelect),
    ]);
    return [
      ...folders.map((f) => utils.map2FolderData(email, f)),
      ...files.map((f) => utils.map2FileData(email, f)),
    ] as ContentData[];
  } catch {
    return [];
  }
}

export async function getDeletedPathSegments(id: number): Promise<{ id: number, name: string}[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [];

  const select = { id: true, name: true };
  return await getDeletedParentHierarchy({ email }, id, select);
}