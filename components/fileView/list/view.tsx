"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RowData } from "../types";
import type { ListViewColumns, ListViewRow } from "./types";


export type FileListViewProps = {
  rows: ListViewRow,
  cols: ListViewColumns[],
  data: RowData[],
};

export default function FileListView({ rows, cols, data }: Readonly<FileListViewProps>) {
  const router = useRouter();

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
      <div className="fileListViewBody">
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
