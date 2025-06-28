import { FileType } from "./fileIcon";

export type FileInfo = {
  name: string | null,
  type: FileType,
  lastModified: string,
  size: string | null,
};
