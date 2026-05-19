import { useRouter } from "next/navigation";


export default function useShowContent() {
  const router = useRouter();

  const showFolder = (id: number): void => {
    const path = `/drive/folder/${id}`;
    router.push(path);
  };

  const showFile = (id: number): void => {
    console.log("Showing FileID:", id);
  }

  return { showFolder, showFile };
}