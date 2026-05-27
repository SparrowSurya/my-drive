import { FileData } from "@/components/content/types";
import { getFilesByUsage } from "@/lib/query/file";
import utils from "@/lib/utils";
import { getServerSession } from "next-auth";


export async function getFilesData(): Promise<FileData[]> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return [];

  const select = {
    id: true,
    name: true,
    size: true,
    updatedAt: true,
    mimeType: true,
    starred: true,
    folder: {
      select: {
        id: true,
        name: true,
        user: {
          select: {
            email: true,
            name: true,
          }
        }
      }
    }
  };

  const files = await getFilesByUsage({ email }, select);
  return files.map(f => utils.map2FileData(email, f));
}