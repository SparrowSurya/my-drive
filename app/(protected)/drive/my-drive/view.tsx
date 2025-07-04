import EmptyState from "@/components/emptyState";
import { getFilesAndFolders } from "./query";
import { FileListView } from "@/components/fileView";
import row from "@/components/fileView/list/row";
import { ListViewColumns } from "@/components/fileView/list/types";


const columns: ListViewColumns[] = ["name", "lastModified", "fileSize", "elipsis"];

export default async function FileView() {
  const data = await getFilesAndFolders();
  return (
    <>
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
          <FileListView data={data} rows={row} cols={columns} />
        )
      }
    </>
  );
}
