import { getStorageUsed } from "@/lib/query/file";
import { getServerSession } from "next-auth";


export async function storageUsed(): Promise<number> {
  const session = await getServerSession();
  const { email } = session?.user ?? {};
  if (!email) return 0;

  try {
    return await getStorageUsed({ email });
  } catch {}

  return 0;
}
