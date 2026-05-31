"use server";

import { getServerSession } from "next-auth";
import { FolderQuery, FileQuery } from "@/lib/query";
import utils from "@/lib/utils";
import { CreateFolderSchema } from "@/lib/schema";


export type CreateFolderFormState = {
  success?: true,
  message?: string,
  parentId: string | number,
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

  const { folderName, parentId } = result.data;

  try {
    const id = (parentId === 0)
      ? (await FolderQuery.readRoot({ email }, { id: true })).id
      : parentId;
    const parentFolder = await FolderQuery.read({ email }, { id }, { name: true, isRoot: true });
    const parentName = parentFolder?.isRoot ? "My Drive" : parentFolder?.name;
    const { name } = await FolderQuery.create({ email }, { id }, { name: folderName }, { name: true });
    return {
      ...result.data,
      success: true,
      message: `Created new folder "${name}" in "${parentName}"`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong" },
    };
  }
}

export async function uploadFiles(parentId: number, files: {
  name: string,
  size: number,
  data: Uint8Array,
}[]): Promise<string | { name: string }[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return "Something went wrong";

  try {
    const id = (parentId === 0)
      ? (await FolderQuery.readRoot({ email }, { id: true })).id
      : parentId;
    const typedFiles = files.map((file) => ({
      file: { ...file, data: new Uint8Array(file.data) },
      folderId: id,
    }));
    return await FileQuery.uploadMany({ email }, typedFiles, { name: true }) ;
  } catch {
    return "Something went wrong";
  }
}

export async function uploadFolder(parentId: number, files: {
  name: string,
  size: number,
  data: Uint8Array,
  path: string,
}[]): Promise<true | string> {

  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return "Something went wrong";

  try {
    const typedFiles = files.map((file) => ({
      ...file,
      data: new Uint8Array(file.data),
    }));
    const tree = utils.buildDirectory(typedFiles);
    const id = (parentId === 0)
      ? (await FolderQuery.readRoot({ email }, { id: true })).id
      : parentId;
    await FolderQuery.createTree({ email }, { id }, tree);
  } catch {
    return "Something went wrong";
  }

  return true;
}
