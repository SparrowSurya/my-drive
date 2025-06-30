

export type FileType = "excel" | "pptx" | "docx" | "pdf" | "zip" | "txt" | "csv" | "file" | "audio" | "video" | "image" | "code" | "folder";


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
