import { Metadata } from "next";
import { getFilesAndFolders } from "./query";
import EmptyState from "@/components/emptyState";
import FileListView from "@/components/fileView/list";
import columns from "@/components/fileView/list/column";
import Breadcrumbs from "@/components/breadcrumbs";


export const metadata: Metadata = {
  title: "My Drive - Drive",
};

export default async function MyDrivePage() {
  const data = await getFilesAndFolders();
  const segments = [{ name: "My Drive", url: "/drive/my-dive" }];

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
          <EmptyState
            image="/assets/svg/empty_state_my_drive.svg"
            title="A place for all of your files"
            para="Drag your files and folders here or use the 'New' button to upload"
          />
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
