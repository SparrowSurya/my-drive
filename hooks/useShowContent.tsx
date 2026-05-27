"use client";

import { useRouter } from "next/navigation";
import useModal from "./useModal";
import FilePreview from "@/components/content/preview";


export default function useShowContent() {
  const router = useRouter();
  const model = useModal();

  const showFolder = (id?: number | null): void => {
    if (typeof id !== "number") {
      console.log("Failed to open folder with invalid ID:", id);
      return;
    }
    const path = `/drive/folder/${id}`;
    router.push(path);
  };

  const showFile = (id?: number | null): void => {
    if (typeof id !== "number") {
      console.log("Failed to open file with invalid ID:", id);
      return;
    }
    model.show(<FilePreview id={id} close={() => model.close(false)} />);
  }

  return { showFolder, showFile };
}