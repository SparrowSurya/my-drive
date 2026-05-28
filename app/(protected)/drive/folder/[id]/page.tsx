import { Metadata } from "next";
import { getFolderContents, getPathSegments, getFolderName, folderDeletionStatus, getDeletedFolderContents, getDeletedPathSegments } from "./query";
import { redirect } from "next/navigation";
import FolderView from "./view";


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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDeleted, directDelete] = await folderDeletionStatus(id);

  const data = isDeleted
    ? await getDeletedFolderContents(id)
    : await getFolderContents(id);

  const segments = isDeleted
    ? (await getDeletedPathSegments(id)).map((segment) => ({
      name: segment.name,
      url: `/drive/folder/${segment.id}`,
    }))
    : (await getPathSegments(id)).map((segment) => (
      (segment.name.length === 0) ? {
        name: "My Drive",
        url: "/drive/my-drive",
      } : {
        name: segment.name,
        url: `/drive/folder/${segment.id}`,
      }
    ));

  return (
    <FolderView data={data} segments={segments} />
  );
}