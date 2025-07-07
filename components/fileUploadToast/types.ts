import { type FileType } from "@/lib/types/file";


export type FileUploadStatus = "success" | "error" | "uploading";

export type FileUpload = {
  id: string,
  name: string,
  path: string,
  type: FileType,
  status: FileUploadStatus,
  progress: number,
  error?: string,
};
