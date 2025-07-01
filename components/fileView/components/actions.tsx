"use server";

import { getServerSession } from "next-auth";
import { updateFolder } from "@/lib/query/folder";
import { updateFile } from "@/lib/query/file";
import { RenameFolderSchema } from "@/lib/validation/folder";
import { RenameFileSchema } from "@/lib/validation/file";


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
      message: `Rename '${folderName}' to '${name}''`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong2" },
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
      message: `Rename '${fileName}' to '${name}''`,
    };
  } catch {
    return {
      ...state,
      errors: { root: "Something went wrong2" },
    };
  }
}
