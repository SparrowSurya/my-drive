import { TimelineGroup } from "@/lib/utils/date";

interface BaseData {
  id?: number,
  name?: string,
  updatedAt?: Date,
  deletedAt?: Date,
  reason?: string,
  isMe: boolean,
  owner?: string,
  type: ContentType,
  parent?: string
  size?: number,
}

export type ContentType = "file" | "folder";

export interface FileData extends BaseData {
  folderId?: number,
  folderName?: string,
  mimeType?: string,
  data?: Uint8Array,
  type: "file",
};

export interface FolderData extends BaseData {
  parentId?: number,
  children?: Array<FolderData>,
  mimeType?: undefined,
  type: "folder",
};

export type ContentData = FileData | FolderData;

export type GroupedContentData = Record<TimelineGroup, ContentData[]>;
