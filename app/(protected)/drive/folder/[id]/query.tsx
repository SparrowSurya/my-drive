"use server";

import { getServerSession } from "next-auth";
import { getFolders, getParentHierarchy } from "@/lib/query/folder";
import { getFiles } from "@/lib/query/file";
import type { RowData, FileData, FolderData } from "@/components/fileView/types";
import utils from "@/lib/utils";
import { getFileType } from "@/components/fileView/utilts";


export async function getFolderContents(id: number): Promise<RowData[]> {
  const session = await getServerSession();
  const { email } = session!.user ;

  const select = { id: true, name: true, updatedAt: true }
  const folders = await getFolders(
    { email },
    { id },
    { ...select, parent: { select: { parentId: true } } },
  );
  const files = await getFiles({ email }, { id: id }, undefined, { ...select, size: true, folderId: true });

  return [
    ...folders.map(f => ({
      id: f.id,
      name: f.name,
      type: "folder",
      size: null,
      parentId: f.parent?.parentId,
      lastModified: utils.formatDate(f.updatedAt),
    } as unknown as FolderData)),
    ...files.map(f => ({
      id: f.id,
      name: f.name,
      type: getFileType(f.name),
      size: utils.formatBytes(f.size),
      folderId: f.folderId,
      lastModified: utils.formatDate(f.updatedAt),
    } as unknown as FileData)),
  ] as RowData[];
}

export async function getPathSegments(id: number): Promise<{ id: number, name: string }[]> {
  const session = await getServerSession();
  const { email } = session!.user ;

  const select = { id: true, name: true };
  return await getParentHierarchy({ email }, { id }, select);
}