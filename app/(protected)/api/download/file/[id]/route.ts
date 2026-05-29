import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import FileQuery from "@/lib/query/file";
import { FileDownloadSchema } from "@/lib/schema";
import utils from "@/lib/utils";


export async function GET(
  req: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>,
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong"}, { status: 401 });
  }

  const { id } = await params;
  const result = FileDownloadSchema.safeParse({ id });
  if (!result.success) {
    const error = utils.getFirstZodError(result.error);
    return NextResponse.json({ error }, { status: 400 });
  }

  const { email } = session.user;
  const fileId  = result.data.id;
  const select = { name: true, data: true, mimeType: true };
  try {
    const file = await FileQuery.read({ email }, { id: fileId }, select);
    const bytes = new Uint8Array(file.data);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "file not found"}, { status: 404 });
  }
}
