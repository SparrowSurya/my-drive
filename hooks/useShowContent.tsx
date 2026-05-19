"use client";

import { useRouter } from "next/navigation";
import useModal from "./useModal";
import FilePreview from "@/components/content/preview";


export default function useShowContent() {
  const router = useRouter();
  const model = useModal();

  const showFolder = (id: number): void => {
    const path = `/drive/folder/${id}`;
    router.push(path);
  };

  const showFile = (id: number): void => {
    model.show(<FilePreview id={id} close={model.close} />);
  }

  return { showFolder, showFile };
}