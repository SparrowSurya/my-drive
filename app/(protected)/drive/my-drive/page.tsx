import { Metadata } from "next";
import { getFilesAndFolders } from "./query";
import FolderView from "./view";
import { EmptyStateProps } from "@/components/emptyState";


export const metadata: Metadata = {
  title: "My Drive - Drive",
};


export default async function MyDrivePage() {
  const data = await getFilesAndFolders();
  const segments = [{ name: "My Drive", url: "/drive/my-drive" }];

  const emptyStateProps: EmptyStateProps = {
    image: '/assets/svg/empty_state_my_drive.svg',
    title: 'A place for all of your files',
    para: 'Drag your files and folders here or use the "New" button to upload',
  };

  return (
    <FolderView data={data} segments={segments} emptyStateProps={emptyStateProps} />
  );
}
