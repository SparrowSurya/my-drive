import { z } from "zod";


export const email = z.string().email();
export const password = z.string().trim().min(3, "password should contains atleast 3 characters");

export const fileName = z.string().trim();
export const fileId = z.number({ coerce: true });

export const folderName = z.string().trim();
export const folderId = z.number({ coerce: true });

export const file = z.instanceof(File);
export const relativePath = z.string().trim().transform(path => {
  const segments = path.split("/");
  segments.pop();
  return segments;
});
