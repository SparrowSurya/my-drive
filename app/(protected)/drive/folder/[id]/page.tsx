import { Metadata } from "next";
import { getFolderContents, getPathSegments, getFolderName, folderDeletionStatus } from "./query";
import { redirect } from "next/navigation";
import FolderView from "./view";
import { ListViewColumn } from "@/components/content/list/types";
import { FilterType } from "@/hooks/useFilter";


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
  if (id === 0) redirect("/drive/my-drive");

  const { deleted: isDeletedFolder } = await folderDeletionStatus(id);

  const data = await getFolderContents(id, isDeletedFolder);

  const segments = [
    isDeletedFolder
      ? { name: "Trash", url: "/drive/trash" }
      : { name: "My Drive", url: "/drive/my-drive" },
    ...(await getPathSegments(id, isDeletedFolder)).map((e) => ({
        name: e.name,
        url: `/drive/folder/${e.id}`,
    })),
  ];

  const headings: ListViewColumn[] = ["name", "owner", "updatedAt", "fileSize", "elipsis"];
  const filterTypes: FilterType[] = ["mimeType", "updatedAt"];

  return (
    <FolderView
      data={data}
      segments={segments}
      headings={headings}
      filterTypes={filterTypes}
    />
  );
}