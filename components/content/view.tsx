"use client";

import EmptyState from "@/components/emptyState";
import useDropzone from "@/hooks/useDropzone";
import useFileUpload from "@/hooks/useFileUpload";
import { FileListView, FileGridView } from "@/components/content";
import row from "@/components/content/list/row";
import { ListViewColumns } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";


const columns: ListViewColumns[] = ["name", "lastModified", "fileSize", "elipsis"];

export type ContentViewProps = {
  data: ContentData[],
  gridView: boolean,
};

export default function ContentView({ data, gridView }: Readonly<ContentViewProps>) {
  const { uploadFile } = useFileUpload();
  const [dropRef, isDragging] = useDropzone(uploadFile);

  return (
    <>
      {
        (data === null || data.length == 0) && (
          <div ref={dropRef} className={`border-2 rounded ${isDragging ? "border-sapphire" : "border-transparent"}`}>
            <EmptyState
              image="/assets/svg/empty_state_my_drive.svg"
              title="A place for all of your files"
              para="Drag your files and folders here or use the 'New' button to upload"
            />
          </div>
        )
      }
      {
        data && data.length > 0 && (
          gridView
            ? <FileGridView data={data} />
            : <FileListView data={data} rows={row} cols={columns} />
        )
      }
    </>
  );
}
