import Image from "next/image";
import { getFolderContents, getPathSegments } from "./query";
import Breadcrumbs from "@/components/breadcrumbs";
import { FileListView } from "@/components/fileView";
import columns from "@/components/fileView/list/column";


export default async function FolderPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>,
}>) {
  const id = parseInt((await params).id);
  const data = await getFolderContents(id);
  const segments = (await getPathSegments(id)).map((segment) => ({
    name: (segment.name.length === 0) ? "My Drive" : segment.name,
    url: `/drive/folder/${segment.id}`,
  }));

  return (
    <>
      <div className="flex flex-row">
        <Breadcrumbs
          className="text-2xl cursor-pointer"
          style={{ transform: "translateX(-12px)" }}
          data={segments}
        />
      </div>
      {
        (data === null || data.length == 0) && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Image
              src="/assets/svg/empty_state_empty_folder.svg"
              alt="empty my drive page"
              width="240"
              height="240"
            />
            <div className="text-2xl mt-10">Drop files here</div>
            <div className="text-md text-subtext0 mt-2">or use the “New” button.</div>
          </div>
        )
      }
      {
        data && data.length > 0 && (
          <FileListView data={data} columns={columns} />
        )
      }
    </>
  );
}