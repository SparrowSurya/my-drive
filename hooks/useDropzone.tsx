import { useState, useCallback, useRef, useEffect, type RefObject } from "react";


export default function useDropzone(onDrop: (files: File[]) => void): [RefObject<HTMLDivElement | null>, boolean]  {
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
    const files = Array.from(e.dataTransfer?.files || []);
    onDrop(files);
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
