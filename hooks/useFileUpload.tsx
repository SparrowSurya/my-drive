import { useContext } from "react";
import { FileUploadContext } from "@/contexts/fileUpload";


export default function useFileUpload() {
  const ctx = useContext(FileUploadContext);
  if (!ctx) throw new Error("useUpload must be used inside FileUploadProvider");
  return ctx;
};
