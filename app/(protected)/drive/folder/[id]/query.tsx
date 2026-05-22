"use server";

import { getServerSession } from "next-auth";
import { getFolder, getFolders, getParentHierarchy } from "@/lib/query/folder";
import { getFiles } from "@/lib/query/file";
import type { ContentData } from "@/components/content/types";
import utils from "@/lib/utils";


export async function getFolderContents(id: number): Promise<ContentData[]> {
  const session = await getServerSession();
  const { email } = session!.user ;

  const select = { id: true, name: true, updatedAt: true };
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
  const { email } = session!.user ;

  const select = { id: true, name: true };
  return await getParentHierarchy({ email }, { id }, select);
}

export async function getFolderName(id: number): Promise<{ name: string }> {
  const session = await getServerSession();
  const { email } = session!.user ;

  const select = { name: true };
  try {
    return await getFolder({ email }, { id }, select);
  } catch {
    return { name: "" };
  }
}
