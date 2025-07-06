import { Metadata } from "next";
import Breadcrumbs from "@/components/breadcrumbs";
import FileView from "./fileView";
import { getFilesAndFolders } from "./query";


export const metadata: Metadata = {
  title: "My Drive - Drive",
};

const segments = [{ name: "My Drive", url: "/drive/my-dive" }];

export default async function MyDrivePage() {
  const data = await getFilesAndFolders();

  return (
    <>
      <div className="flex flex-row">
        <Breadcrumbs
          className="text-2xl cursor-pointer"
          style={{ transform: "translateX(-12px)" }}
          data={segments}
        />
      </div>
      <FileView data={data} />
    </>
  );
}
