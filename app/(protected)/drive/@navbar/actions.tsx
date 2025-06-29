"use server";

import { getServerSession } from "next-auth";
import { getOrCreateRootFolder, createFolder, folderExists } from "@/lib/query/folder";
import { addFiles } from "@/lib/query/file";


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
