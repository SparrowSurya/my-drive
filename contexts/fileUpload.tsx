"use client";

import React, { createContext, useState } from "react";
import FileUploadToast from "@/components/fileUploadToast";
import { getFileType } from "@/components/fileView/utilts";
import { type FileUpload } from "@/components/fileUploadToast/types";
import { type FileWithRelativePath } from "@/hooks/useDropzone";


export type UploadContextType = {
  uploads: FileUpload[];
  uploadFile: (file: FileWithRelativePath) => void;
};

export const FileUploadContext = createContext<UploadContextType | undefined>(undefined);

export default function FileUploadProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [showUpload, setShowUpload] = useState(true);

  const uploadFile = (file: FileWithRelativePath) => {
    const id = crypto.randomUUID();
    const newUpload: FileUpload = {
      id,
      name: file.name,
      path: file.relativePath,
      type: getFileType(file.name),
      progress: 0,
      status: "uploading",
    };
    setUploads((prev) => [...prev, newUpload]);
    setShowUpload(true);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      const percent = Math.round((e.loaded * 100) / e.total);
      setUploads((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, progress: percent } : item
        )
      );
    };
    xhr.onload = () => {
      setUploads((prev) =>
        prev.map((item) =>
          (item.id === id) ? { ...item, status: "success" } : item
      ));
    };
    xhr.onerror = () => {
      setUploads((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "error" } : item
        )
      );
    };

    xhr.open("POST", "/api/upload");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("relativePath", file.relativePath)
    xhr.send(formData);
  };

  return (
    <FileUploadContext.Provider value={{ uploads, uploadFile }}>
      { children }
      {
        uploads.length && showUpload && (
          <FileUploadToast
            uploads={uploads}
            onClose={() => {
              setShowUpload(false);
              setUploads([]);
            }}
            className="fixed bottom-0 right-8"
          />
        )
      }
    </FileUploadContext.Provider>
  );
};
