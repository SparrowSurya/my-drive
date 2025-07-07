import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getFolder, getFolderContents } from "@/lib/query/folder";
import { FolderDownloadSchema } from "@/lib/schema";
import utils from "@/lib/utils";
import { zipFiles } from "@/lib/zip";


export async function GET(
  req: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>,
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong"}, { status: 401 });
  }

  const { id } = await params;
  const result = FolderDownloadSchema.safeParse({ id });
  if (!result.success) {
    const error = utils.getFirstZodError(result.error);
    return NextResponse.json({ error }, { status: 400 });
  }

  const { email } = session.user;
  const folderId  = result.data.id;
  try {
    const files = await getFolderContents({ email }, { id: folderId }, { name: true, data: true });
    const folder = await getFolder({ email }, { id: folderId }, { name: true });
    const zipData = await zipFiles(files);
    return new NextResponse(zipData, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${folder.name}.zip"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "file not found"}, { status: 404 });
  }
}
