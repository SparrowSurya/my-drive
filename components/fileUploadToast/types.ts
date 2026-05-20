
export type FileUploadStatus = "success" | "error" | "uploading";

export type FileUpload = {
  id: string,
  name: string,
  path: string,
  status: FileUploadStatus,
  progress: number,
  error?: string,
  mimeType: string,
};
