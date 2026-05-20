
interface BaseData {
  id: number,
  name: string,
  lastModified: string,
  reason?: string,
  isMe?: boolean,
  owner?: string,
  type: string,
}

export interface FileData extends BaseData {
  size: string,
  folderId: number,
  mimeType: string,
  data?: Uint8Array,
  type: "file",
};

export interface FolderData extends BaseData {
  size: null,
  parentId: number,
  type: "folder",
};

export type ContentData = FileData | FolderData;
