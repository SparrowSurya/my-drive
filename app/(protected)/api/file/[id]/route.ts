import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getFile } from "@/lib/query/file";
import { ReadFileDataSchema } from "@/lib/schema";
import utils from "@/lib/utils";
import { detectMimeTypeFromBuffer } from "@/lib/mime/detection";


export async function GET(
  req: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>,
): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong" }, { status: 401 });
  }

  const { id } = await params;
  const result = ReadFileDataSchema.safeParse({ id });
  if (!result.success) {
    const error = utils.getFirstZodError(result.error);
    return NextResponse.json({ error }, { status: 400 });
  }

  const { email } = session.user;
  const fileId = result.data.id;
  const fileSelect = {
    id: true,
    name: true,
    size: true,
    mimeType: true,
    updatedAt: true,
    data: true,
    folderId: true,
    folder: {
      select: {
        user: {
          select: { name: true, email: true },
        },
      },
    },
  };

  try {
    const f = await getFile({ email }, { id: fileId }, fileSelect);
    if (f.mimeType === "") {
      f.mimeType = detectMimeTypeFromBuffer(f.data).mimeType;
    }
    return NextResponse.json({
      id: f.id,
      name: f.name,
      size: utils.formatBytes(f.size),
      mimeType: f.mimeType,
      folderId: f.folderId,
      data: Buffer.from(f.data).toString("base64"),
      owner: f.folder.user.email == email ? "me" : f.folder.user.name,
      lastModified: utils.formatDate(f.updatedAt),
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
