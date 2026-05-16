import React from "react";
import { ContentData } from "../types";
import type { ListViewColumns, ListViewRow } from "./types";
import useDropzone from "@/hooks/useDropzone";
import useFileUpload from "@/hooks/useFileUpload";


export type FileListViewProps = {
  rows: ListViewRow,
  cols: ListViewColumns[],
  data: ContentData[],
  openFolder: (id: number) => void,
};

export default function ContentListView({ rows, cols, data, openFolder }: Readonly<FileListViewProps>) {
  const { uploadFile } = useFileUpload();
  const [dropRef, isDragging] = useDropzone(uploadFile);

  return (
    <div className="fileListView">
      <div className="fileListViewHead">
        {
          cols.map((col) => (
            <div key={col} className={`listColumn_${col}`}>
              { rows[col].head }
            </div>
          ))
        }
      </div>
      <div
        ref={dropRef}
        className={`fileListViewBody border-2 rounded ${isDragging ? "border-sapphire" : "border-transparent"}`}
      >
        {
          data.map((d) => (
            <div
              key={d.id}
              className="fileListRow"
              onDoubleClick={d.type == "folder" ? () => openFolder(d.id): undefined}
            >
              {
                cols.map((col) => rows[col].body(d, col))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
