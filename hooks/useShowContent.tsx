import { useRouter } from "next/navigation";


export default function useShowContent() {
  const router = useRouter();

  const showFolder = (id: number): void => {
    const path = `/driv/folder/${id}`;
    router.push(path);
  };

  return { showFolder };
}