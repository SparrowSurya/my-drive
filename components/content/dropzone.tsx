import useDropzone from "@/hooks/useDropzone";
import useFileUpload from "@/hooks/useFileUpload";
import React from "react";

export type ContentDropZoneProps = {
  children: React.ReactNode,
};

export default function ContentDropZone({ children }: Readonly<ContentDropZoneProps>) {
  const { uploadFile } = useFileUpload();
  const [dropRef, isDragging] = useDropzone(uploadFile);

  return (
    <div
      ref={dropRef}
      className={`border-2 rounded ${isDragging ? "border-sapphire" : "border-transparent"}`}
    >
      {children}
    </div>
  );
}
