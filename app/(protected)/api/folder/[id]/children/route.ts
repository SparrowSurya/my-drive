import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { FolderChildrenDataSchema } from "@/lib/schema";
import utils from "@/lib/utils";
import { FolderQuery } from "@/lib/query";


export async function GET(
  req: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>,
): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong" }, { status: 401 });
  }

  const { id } = await params;
  const result = FolderChildrenDataSchema.safeParse({ id });
  if (!result.success) {
    const error = utils.getFirstZodError(result.error);
    return NextResponse.json({ error }, { status: 400 });
  }

  const { email } = session.user;
  const folderId = result.data.id === 0 ? null : result.data.id;
  const select = {
    id: true,
    name: true,
    parent: { select: { parent: { select: {id: true, name: true} } } },
    user: {
      select: { name: true, email: true },
    },
  } as const;

  try {
    const parentId = !!folderId
      ? folderId
      : (await FolderQuery.readRoot({ email }, { id: true })).id;
    const folders = await FolderQuery.readChildFolders({ email }, { id: parentId }, {}, select);
    const foldersData = folders.map((f) => utils.map2FolderData(email, f));
    foldersData.forEach((f) => f.reason = undefined);
    return NextResponse.json(foldersData, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }
}
