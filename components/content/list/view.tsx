import React from "react";
import { ContentData } from "../types";
import type { ListViewColumns, ListViewRow } from "./types";


export type FileListViewProps<T extends ContentData> = {
  rows: ListViewRow,
  cols: ListViewColumns[],
  data: T[],
  showFolder: (id: number) => void,
  className?: string,
  scrollable?: boolean,
};

export default function ContentListView<T extends ContentData>(
  { rows, cols, data, showFolder, className, scrollable = true }: Readonly<FileListViewProps<T>>,
) {
  return (
    <div className={className ?? "fileListView flex flex-col h-full overflow-hidden"}>
      <div className="fileListViewHead shrink-0">
        {
          cols.map((col) => (
            <div key={col} className={`listColumn_${col}`}>
              { rows[col].head }
            </div>
          ))
        }
      </div>
      <div className={scrollable ? "fileListViewBody flex-1 overflow-y-auto min-h-0" : "fileListViewBody flex flex-col"}>
      {
        data.map((d) => (
          <div
          key={d.id}
          className="fileListRow"
          onDoubleClick={d.type == "folder" ? () => showFolder(d.id): undefined}
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
