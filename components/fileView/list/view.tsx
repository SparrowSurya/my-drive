"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RowData } from "../types";
import type { ListViewColumns, ListViewRow } from "./types";
import useDropzone from "@/hooks/useDropzone";
import useFileUpload from "@/hooks/useFileUpload";


export type FileListViewProps = {
  rows: ListViewRow,
  cols: ListViewColumns[],
  data: RowData[],
};

export default function FileListView({ rows, cols, data }: Readonly<FileListViewProps>) {
  const router = useRouter();
  const { uploadFile } = useFileUpload();
  const [dropRef, isDragging] = useDropzone(uploadFile);

  return (
    <div className="fileListView">
      <div className="fileListViewHead">
        {
          cols.map((col) => (
            <div key={col} className={`fileColumn_${col}`}>
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
              onDoubleClick={() => {
                if (d.type === "folder") {
                  router.push(`/drive/folder/${d.id}`);
                }
              }}
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
