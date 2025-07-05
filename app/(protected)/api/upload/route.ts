import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { addFileWithRelativePath } from "@/lib/query/file";
import { FileUploadSchema } from "@/lib/validation/upload";


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = FileUploadSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    const error = Object.entries(result.error.flatten().fieldErrors)
      .entries()
      .map(([key, value]) => value) // eslint-disable-line @typescript-eslint/no-unused-vars
      .filter(value => !!value && value.length > 0)
      .toArray()[0];
    return NextResponse.json({ error: error ?? "something went wrong"}, { status: 400 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong"}, { status: 401 });
  }

  const { email } = session.user;
  const { file, relativePath, folderId } = result.data;
  const arrayBuf = await file.arrayBuffer();

  try {
    const newFile = await addFileWithRelativePath({ email }, {
      name: file.name,
      data: new Uint8Array(arrayBuf),
      folderId,
      path: relativePath,
    }, { id: true, name: true, folderId: true, updatedAt: true, size: true });
    return NextResponse.json({ file: newFile, success: true });
  } catch {
    return NextResponse.json({ error: "something went wrong" }, { status: 409 })
  }
}
