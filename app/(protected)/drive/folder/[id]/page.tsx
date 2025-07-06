import { Metadata } from "next";
import { getFolderContents, getPathSegments, getFolderName } from "./query";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import FileView from "./fileview";


export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: string }>,
}>): Promise<Metadata> {
  const { id } = await params;
  const { name } = await getFolderName(parseInt(id));

  return {
    title: `${name} - Drive`,
  };
}

export default async function FolderPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>,
}>) {
  const id = parseInt((await params).id);
  if (id === 0) {
    return redirect("/drive/my-drive");
  }

  const data = await getFolderContents(id);
  const segments = (await getPathSegments(id)).map((segment) => (
    (segment.name.length === 0) ? {
      name: "My Drive",
      url: "/drive/my-drive",
    } : {
      name: segment.name,
      url: `/drive/folder/${segment.id}`,
    }
  ));

  return (
    <>
      <div className="flex flex-row">
        <Breadcrumbs style={{ transform: "translateX(-12px)" }} data={segments} />
      </div>
      <FileView data={data} />
    </>
  );
}