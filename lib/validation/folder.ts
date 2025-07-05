import { z } from "zod";

const folderName = z.string().trim();

export const CreateFolderSchema = z.object({
  folderName,
  parentId: z.number({ coerce: true }),
});

export const RenameFolderSchema = z.object({
  folderName,
  folderId: z.number({ coerce: true }),
});
