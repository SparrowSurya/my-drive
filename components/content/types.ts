import { TimelineGroup } from "@/lib/utils/date";

interface BaseData {
  id: number,
  name: string,
  lastModified: string,
  updatedAt?: Date,
  deletedAt?: Date,
  dateTrashed?: string,
  reason?: string,
  isMe?: boolean,
  owner?: string,
  type: ContentType,
  parent?: string
}

export type ContentType = "file" | "folder";

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

export type GroupedContentData = Record<TimelineGroup, ContentData[]>;
