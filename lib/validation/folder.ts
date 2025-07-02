import { z } from "zod";

const folderName = z.string().trim().regex(/^[a-zA-Z0-9-_ ]+$/, "folder name can include letters, digits, -, _ and space characters onlys");

export const CreateFolderSchema = z.object({
  folderName,
  parentId: z.number({ coerce: true }),
});

export const RenameFolderSchema = z.object({
  folderName,
  folderId: z.number({ coerce: true }),
});
