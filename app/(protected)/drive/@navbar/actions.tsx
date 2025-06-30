"use server";

import { getServerSession } from "next-auth";
import { getOrCreateRootFolder, createFolder, folderExists, createFileTree } from "@/lib/query/folder";
import { addFiles } from "@/lib/query/file";
import { buildDirectory } from "@/lib/utils/tree";

export async function createFolderAction(folderName: string): Promise<[boolean, string]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [false, "Something went wrong"];

  if (await folderExists({ user: { email }, name: folderName })) return [false, "Folder already exists"];

  try {
    const rootFolder = await getOrCreateRootFolder({ email }, { id: true });
    const { name } = await createFolder({ email }, { id: rootFolder.id }, { name: folderName }, { name: true });
    return [true, name!];
  } catch {
    return [false, "Something went wrong"];
  }
}

export async function uploadFilesAction(files: {
  name: string,
  size: number,
  data: Uint8Array,
}[]): Promise<string | { name: string }[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return "Something went wrong";

  try {
    return await addFiles(
      { email },
      { name_parentId: { name: "", parentId: 0 } },
      files,
      { name: true },
    )
  } catch {
    return "Something went wrong";
  }
}

export async function uploadFolderAction(files: {
  name: string,
  size: number,
  data: Uint8Array,
  path: string,
}[]): Promise<true | string> {

  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return "Something went wrong";

  try {
    const tree = buildDirectory(files);
    const root = await getOrCreateRootFolder({ email });
    await createFileTree({ email }, { name_parentId: { parentId: root.id, name: root.name } }, tree);
  } catch {
    return "Something went wrong";
  }

  return true;
}