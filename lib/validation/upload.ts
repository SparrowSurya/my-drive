import { z } from "zod";


export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  relativePath: z.string().trim().transform(path => {
    const segments = path.split("/");
    segments.pop();
    return segments;
  }),
  folderId: z.number({ coerce: true }),
});
