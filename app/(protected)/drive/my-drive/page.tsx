import { Metadata } from "next";
import { getFilesAndFolders } from "./query";
import FolderView from "../folder/[id]/view";


export const metadata: Metadata = {
  title: "My Drive - Drive",
};


export default async function MyDrivePage() {
  const data = await getFilesAndFolders();
  const segments = [{ name: "My Drive", url: "/drive/my-drive" }];

  return <FolderView data={data} segments={segments} />;
}
