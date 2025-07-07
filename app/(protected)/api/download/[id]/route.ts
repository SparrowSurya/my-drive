import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getFile } from "@/lib/query/file";
import { FileDownloadSchema } from "@/lib/schema";
import utils from "@/lib/utils";


export async function GET(
  req: NextRequest,
  { params }: Readonly<{ params: { id: string } }>,
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong"}, { status: 401 });
  }

  const result = FileDownloadSchema.safeParse(params);
  if (!result.success) {
    const error = utils.getFirstZodError(result.error)
    return NextResponse.json({ error }, { status: 400 });
  }

  const { email } = session.user;
  const { id } = result.data;
  try {
    const file = await getFile({ email }, { id }, { name: true, data: true });
    const type = utils.getFileType(file.name);
    return new NextResponse(file.data, {
      headers: {
        "Content-Type": utils.getContentType(type),
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "file not found"}, { status: 404 });
  }
}
