import React from "react";
import { ContentData } from "../types";
import type { ListViewColumns } from "./types";
import rowBuilder from "./row";


export type FileListViewProps = {
  cols: ListViewColumns[],
  data: ContentData[],
  showFolder: (id: number) => void,
  className?: string,
  scrollable?: boolean,
};

export default function ContentListView({
  cols,
  data,
  showFolder,
  className,
  scrollable = true,
}: Readonly<FileListViewProps>) {
  return (
    <div className={className ?? "fileListView flex flex-col h-full overflow-hidden"}>
      <div className="fileListViewHead shrink-0">
        {
          cols.map((col) => (
            <div key={col} className={`listColumn_${col}`}>
              { rowBuilder[col].head }
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
              cols.map((col) => rowBuilder[col].body(d, col))
            }
          </div>
        ))
      }
      </div>
    </div>
  );
}
