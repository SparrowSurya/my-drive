"use client";

import React, { createContext, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import FileUploadToast from "@/components/fileUploadToast";
import { type FileUpload } from "@/components/fileUploadToast/types";
import { type FileWithRelativePath } from "@/hooks/useDropzone";
import utils from "@/lib/utils";
import { detectMimeTypeFromBuffer } from "@/lib/mime/detection";


export type UploadContextType = {
  uploads: FileUpload[];
  uploadFile: (file: FileWithRelativePath) => void;
  requestFileUpload: () => void;
  requestFolderUpload: () => void;
};

export const FileUploadContext = createContext<UploadContextType | undefined>(undefined);

export default function FileUploadProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const path = usePathname();

  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [showUpload, setShowUpload] = useState(true);
  const { refresh: refreshTransition } = useDebounce(() => startTransition(() => router.refresh()), 1000);

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderUploadRef.current) {
      folderUploadRef.current.setAttribute("webkitdirectory", "");
    }
  }, []);

  const uploadFile = async (file: FileWithRelativePath) => {
    const id = crypto.randomUUID();
    const folderId = utils.getFolderIdByPathname(path);
    const fileName = file.relativePath.split("/").pop() || file.name;
    const buffer = new Uint8Array(await file.arrayBuffer());
    const newUpload: FileUpload = {
      id,
      name: fileName,
      path: file.relativePath,
      progress: 0,
      status: "uploading",
      mimeType: detectMimeTypeFromBuffer(buffer).mimeType,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        (file as FileWithRelativePath).relativePath = file.name;
        uploadFile(file as FileWithRelativePath);
      });
    }
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        (file as FileWithRelativePath).relativePath = file.webkitRelativePath;
        uploadFile(file as FileWithRelativePath);
      });
    }
    if (folderUploadRef.current) {
      folderUploadRef.current.value = "";
    }
  };

  const requestFileUpload = () => fileUploadRef.current?.click();
  const requestFolderUpload = () => folderUploadRef.current?.click();

  const value = {
    uploads,
    uploadFile,
    requestFileUpload,
    requestFolderUpload
  };

  return (
    <FileUploadContext.Provider value={value}>
      { children }
      {
        (uploads.length > 0) && showUpload && (
          <FileUploadToast
            uploads={uploads}
            onClose={() => {
              setShowUpload(false);
              setUploads([]);
            }}
            className="fixed bottom-0 right-8 mb-3"
          />
        )
      }
      <input ref={fileUploadRef} type="file" multiple style={{ display: "none" }} onChange={handleFileUpload} />
      <input ref={folderUploadRef} type="file" multiple style={{ display: "none" }} onChange={handleFolderUpload} />
    </FileUploadContext.Provider>
  );
};
