"use client";

import React, { createContext, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import FileUploadToast from "@/components/fileUploadToast";
import { type FileUpload } from "@/components/fileUploadToast/types";
import { type FileWithRelativePath } from "@/hooks/useDropzone";
import utils from "@/lib/utils";


export type UploadContextType = {
  uploads: FileUpload[];
  uploadFile: (file: FileWithRelativePath) => void;
};

export const FileUploadContext = createContext<UploadContextType | undefined>(undefined);

export default function FileUploadProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [showUpload, setShowUpload] = useState(true);
  const path = usePathname();
  const { refresh: refreshTransition } = useDebounce(() => startTransition(() => router.refresh()), 1000);

  const uploadFile = (file: FileWithRelativePath) => {
    const id = crypto.randomUUID();
    const folderId = utils.getFolderIdByPathname(path);
    const newUpload: FileUpload = {
      id,
      name: file.name,
      path: file.relativePath,
      type: utils.getFileType(file.name),
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
      const success = xhr.status >= 200 && xhr.status < 300;
      const error = success ? undefined : xhr.response;
      setUploads((prev) =>
        prev.map((item) =>
          (item.id === id) ? { ...item, status: success ? "success" : "error", error } : item
      ));
      refreshTransition();
    };
    xhr.onerror = () => {
      setUploads((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "error", error: "upload failed" } : item
      ));
    };

    xhr.open("POST", "/api/upload");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("relativePath", file.relativePath);
    formData.append("folderId", folderId.toString());
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
