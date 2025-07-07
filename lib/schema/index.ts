import { z } from "zod";
import * as field from "./fields";


export const LoginSchema = z.object({
  email: field.email,
  password: field.password,
});

export const SigninSchema = z.object({
  email: field.email,
  password: field.password,
  confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "passwords do not match",
});

export const CreateFolderSchema = z.object({
  folderName: field.folderName,
  parentId: field.folderId,
});

export const RenameFolderSchema = z.object({
  folderName: field.folderName,
  folderId: field.folderId,
});

export const RenameFileSchema = z.object({
  fileName: field.fileName,
  fileId: field.fileId,
});

export const FileUploadSchema = z.object({
  file: field.file,
  relativePath: field.relativePath,
  folderId: field.folderId,
});

export const FileDownloadSchema = z.object({
  id: field.fileId,
});

export const FolderDownloadSchema = z.object({
  id: field.folderId,
});
