import { z } from "zod";


export const RenameFileSchema = z.object({
  fileName: z.string().trim(),
  fileId: z.number({ coerce: true }),
});
