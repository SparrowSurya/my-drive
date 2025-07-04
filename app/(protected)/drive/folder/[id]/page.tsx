import { redirect } from "next/navigation";
import { getFolderContents, getPathSegments } from "./query";
import Breadcrumbs from "@/components/breadcrumbs";
import EmptyState from "@/components/emptyState";
import { FileListView } from "@/components/fileView";
import row from "@/components/fileView/list/row";
import { ListViewColumns } from "@/components/fileView/list/types";


const columns: ListViewColumns[] = ["name", "lastModified", "fileSize", "elipsis"];

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
      {
        (data === null || data.length == 0) && (
          <EmptyState
            image="/assets/svg/empty_state_empty_folder.svg"
            title="Drop files here"
            para="or use the “New” button"
          />
        )
      }
      {
        data && data.length > 0 && (
          <FileListView data={data} rows={row} cols={columns} />
        )
      }
    </>
  );
}