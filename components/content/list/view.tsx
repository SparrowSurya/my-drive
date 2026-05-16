import React from "react";
import { ContentData } from "../types";
import type { ListViewColumns, ListViewRow } from "./types";


export type FileListViewProps = {
  rows: ListViewRow,
  cols: ListViewColumns[],
  data: ContentData[],
  openFolder: (id: number) => void,
};

export default function ContentListView({ rows, cols, data, openFolder }: Readonly<FileListViewProps>) {
  return (
    <div className="fileListView flex flex-col h-full overflow-hidden">
      <div className="fileListViewHead shrink-0">
        {
          cols.map((col) => (
            <div key={col} className={`listColumn_${col}`}>
              { rows[col].head }
            </div>
          ))
        }
      </div>
      <div className="fileListViewBody flex-1 overflow-y-auto min-h-0">
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
