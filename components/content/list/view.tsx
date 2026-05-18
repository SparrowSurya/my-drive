import React from "react";
import { ContentData } from "../types";
import { colDivisions, type ListViewColumns } from "./types";
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
  const gridTemplateColumns = cols.map((c) => colDivisions[c]).join(' ');

  return (
    <div className={className ?? "flex flex-col h-full w-full select-none overflow-hidden"}>
      <div
        className={`grid h-12 border-2 border-b-surface0 border-t-transparent border-l-transparent border-r-transparent font-bold shrink-0`}
        style={{ gridTemplateColumns }}
      >
        {
          cols.map((col) => (
            <div key={col} className="flex items-center">
              { rowBuilder[col].head }
            </div>
          ))
        }
      </div>
      <div className={`w-full ${scrollable ? "w-full flex-1 overflow-y-auto min-h-0" : "w-full flex flex-col"}`}>
      {
        data.map((d) => (
          <div
          key={d.id}
          className="grid h-12 border-b-2 border-surface0 hover:bg-overlay0/30"
          style={{ gridTemplateColumns }}
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
