import { FileType } from "./fileIcon";

export type FileData = {
  name: string | null,
  type: FileType,
  lastModified: string,
  size: string | null,
};
