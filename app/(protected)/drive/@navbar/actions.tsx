"use server";

import { getServerSession } from "next-auth";
import { getOrCreateRootFolder, createFolder, folderExists, createFileTree } from "@/lib/query/folder";
import { addFiles } from "@/lib/query/file";
import { buildDirectory } from "@/lib/utils/tree";
import { CreateFolderSchema } from "@/lib/validation/folder";


export type CreateFolderFormState = {
  success?: true,
  message?: string,
  folderName: string,
  errors?: Partial<Record<keyof Omit<CreateFolderFormState, "errors">, string[]>> & { root?: string },
};


export async function createFolderAction(state: CreateFolderFormState, formData: FormData): Promise<CreateFolderFormState> {
  const result = CreateFolderSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) return {
      ...state,
      errors: result.error?.flatten().fieldErrors,
  };

  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return {
    ...state,
    errors: { root: "Something went wrong" },
  };

  const { folderName } = result.data;
  if (await folderExists({ user: { email }, name: folderName })) return {
    ...state,
    errors: { folderName: ["Folder already exists"] },
  };

  try {
    const rootFolder = await getOrCreateRootFolder({ email }, { id: true });
    const { name } = await createFolder({ email }, { id: rootFolder.id }, { name: folderName }, { name: true });
    return {
      ...result.data,
      success: true,
      message: `created '${name}' folder`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong" },
    };
  }
}

export async function uploadFiles(files: {
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

export async function uploadFolder(files: {
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