import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { FolderQuery } from "@/lib/query";


export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong" }, { status: 401 });
  }

  const { email } = session.user;
  const { folderId, targetFolderId } = await req.json();

  try {
    await FolderQuery.move({ email }, { id: folderId }, { id: targetFolderId }, { id: true });
    return NextResponse.json({ message: "Folder moved successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}