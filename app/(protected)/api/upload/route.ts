import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const relativePath = formData.get("relativePath")

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  console.log("File:", file);
  console.log("RelativePath:", relativePath);
  // const arrayBuffer = await file.arrayBuffer();
  // const uint8Array = new Uint8Array(arrayBuffer);

  // console.log("Filename:", (file as File).name);
  // console.log("Size (bytes):", file.size);
  // console.log("First 20 bytes:", uint8Array.slice(0, 20));

  return NextResponse.json({ success: true });
}
