import Image from "next/image";
import { getFilesAndFolders } from "./query";
import FileListView from "@/components/fileView/list";
import columns from "@/components/fileView/list/column";
import Breadcrumbs from "@/components/breadcrumbs";


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
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Image
              src="/assets/svg/empty_state_my_drive.svg"
              alt="empty my drive page"
              width="240"
              height="240"
            />
            <div className="text-2xl mt-10">A place for all of your files</div>
            <div className="text-md text-subtext0 mt-2">Drag your files and folders here or use the &apos;New&apos; button to upload</div>
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
