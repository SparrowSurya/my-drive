import { z } from "zod";


export const CreateFolderSchema = z.object({
  folderName: z.string().trim().regex(/^[a-zA-Z0-9-_ ]+$/, "folder name can include letters, digits, -, _ and space characters onlys")
});
