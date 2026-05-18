import { type FileType } from "@/lib/types/file";

interface BaseData {
  id: number,
  name: string,
  lastModified: string,
  reason?: string,
  owner?: string,
}

export interface FileData extends BaseData {
  type: Exclude<FileType, "folder">,
  size: string,
  folderId: number,
};

export interface FolderData extends BaseData {
  type: "folder",
  size: null,
  parentId: number,
};

export type ContentData = FileData | FolderData;
