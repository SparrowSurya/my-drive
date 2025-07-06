"use client";

import { useState, useCallback, useRef, useEffect, type RefObject } from "react";


export interface FileWithRelativePath extends File {
  relativePath: string;
}

export default function useDropzone(onDrop: (files: FileWithRelativePath) => void): [RefObject<HTMLDivElement | null>, boolean] {
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const uploadEntry = (entry: FileSystemEntry, path: string = "") => {
      if (entry.isFile) {
        (entry as FileSystemFileEntry).file((file) => {
          (file as any).relativePath = path + file.name; // eslint-disable-line @typescript-eslint/no-explicit-any
          onDrop(file as FileWithRelativePath);
        });
      } else if (entry.isDirectory) {
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        reader.readEntries((entries: FileSystemEntry[]) => {
          entries.forEach((child) => uploadEntry(child, path + entry.name + "/"));
        });
      }
    };

    const items = e.dataTransfer?.items || [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry && item.webkitGetAsEntry();
      if (entry) {
        uploadEntry(entry);
      }
    }
  }, [onDrop]);


  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    ele.addEventListener("dragover", handleDragOver);
    ele.addEventListener("dragleave", handleDragLeave);
    ele.addEventListener("drop", handleDrop);
    return () => {
      ele.removeEventListener("dragover", handleDragOver);
      ele.removeEventListener("dragleave", handleDragLeave);
      ele.removeEventListener("drop", handleDrop);
    };
  }, [handleDragOver, handleDragLeave, handleDrop]);

  return [ref, isDragging];
}

