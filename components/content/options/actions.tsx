"use server";

import { getServerSession } from "next-auth";
import { updateFolder } from "@/lib/query/folder";
import { softDelete, updateFile } from "@/lib/query/file";
import { RenameFolderSchema, RenameFileSchema, FileSoftDeleteSchema } from "@/lib/schema";


export type RenameFolderFormState = {
  success?: true,
  message?: string,
  folderId: number,
  folderName: string,
  errors?: Partial<Record<keyof Omit<RenameFolderFormState, "errors">, string[]>> & { root?: string },
};

export async function FolderRenameAction(state: RenameFolderFormState, formData: FormData): Promise<RenameFolderFormState> {
  const result = RenameFolderSchema.safeParse(Object.fromEntries(formData.entries()))
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

  const { folderName, folderId } = result.data;

  try {
    const { name } = await updateFolder({ email }, { id: folderId }, { name: folderName }, { name: true });
    return {
      ...result.data,
      success: true,
      message: `Renamed folder "${folderName}" to "${name}"`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong" },
    };
  }
}


export type RenameFileFormState = {
  success?: true,
  message?: string,
  fileId: number,
  fileName: string,
  errors?: Partial<Record<keyof Omit<RenameFileFormState, "errors">, string[]>> & { root?: string },
};

export async function FileRenameAction(state: RenameFileFormState, formData: FormData): Promise<RenameFileFormState> {
  const result = RenameFileSchema.safeParse(Object.fromEntries(formData.entries()))
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

  const { fileName, fileId } = result.data;

  try {
    const { name } = await updateFile({ email }, { id: fileId }, { name: fileName }, { name: true });
    return {
      ...result.data,
      success: true,
      message: `Renamed file "${fileName}" to "${name}"`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong" },
    };
  }
}

export type FileSoftDeleteState = {
  success?: true,
  message?: string,
  fileId: number,
  errors?: Partial<Record<keyof Omit<FileSoftDeleteState, "errors">, string[]>> & { root?: string },
};

export async function FileSoftDeleteAction(state: FileSoftDeleteState, formData: FormData): Promise<FileSoftDeleteState> {
  const result = FileSoftDeleteSchema.safeParse(Object.fromEntries(formData.entries()))
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

  const { fileId } = result.data;

  try {
    const { name } = await softDelete({ email }, { id: fileId }, { name: true });
    return {
      ...result.data,
      success: true,
      message: `File "${name}" sent to trash`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong" },
    };
  }
}