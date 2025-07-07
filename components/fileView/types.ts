import { type FileType } from "@/lib/types/file";


export interface FileData {
  id: number,
  name: string,
  type: Omit<FileType, "folder">,
  size: string,
  folderId: number,
  lastModified: string,
};

export interface FolderData {
  id: number,
  name: string,
  type: "folder",
  size: null,
  parentId: number,
  lastModified: string,
};

export type RowData = FileData | FolderData;
