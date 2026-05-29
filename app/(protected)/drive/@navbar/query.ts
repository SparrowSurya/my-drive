import FileQuery from "@/lib/query/file";
import { getServerSession } from "next-auth";


export async function storageUsed(): Promise<number> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return 0;

  try {
    return await FileQuery.readStorageUsed({ email });
  } catch {}

  return 0;
}
