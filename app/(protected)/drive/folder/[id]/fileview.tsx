"use client";

import EmptyState from "@/components/emptyState";
import useDropzone from "@/hooks/useDropzone";
import useFileUpload from "@/hooks/useFileUpload";
import { FileListView } from "@/components/content";
import row from "@/components/content/list/row";
import { ListViewColumns } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";


const columns: ListViewColumns[] = ["name", "lastModified", "fileSize", "elipsis"];

export default function FileView({ data }: Readonly<{ data: ContentData[] }>) {
  const { uploadFile } = useFileUpload();
  const [dropRef, isDragging] = useDropzone(uploadFile);

  return (
    <>
      {
        (data === null || data.length == 0) && (
          <div ref={dropRef} className={`flex-1 flex justify-center items-center border-2 rounded ${isDragging ? "border-sapphire" : "border-transparent"}`}>
            <EmptyState
              image="/assets/svg/empty_state_empty_folder.svg"
              title="Drop files here"
              para="or use the “New” button"
            />
          </div>
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