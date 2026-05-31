import FolderQuery from "@/lib/query/folder";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "something went wrong" }, { status: 401 });
  }

  const { email } = session.user;
  try {
    const root = await FolderQuery.readRoot({ email }, { id: true });
    return NextResponse.json({ id: root.id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}