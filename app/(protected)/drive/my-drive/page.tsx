import { Metadata } from "next";
import { getFilesAndFolders } from "./query";
import FolderView from "../folder/[id]/view";
import { ListViewColumn } from "@/components/content/list/types";
import { FilterType } from "@/hooks/useFilter";


export const metadata: Metadata = {
  title: "My Drive - Drive",
};

export default async function MyDrivePage() {
  const data = await getFilesAndFolders();

  const segments = [{ name: "My Drive", url: "/drive/my-drive" }];
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
