import React from "react";
import { ContentData } from "../types";
import { colDivisions, type ListViewColumns } from "./types";
import rowBuilder from "./row";


export type FileListViewProps = {
  cols: ListViewColumns[],
  data: ContentData[],
  showFolder: (id: number) => void,
  showFile: (id: number) => void,
  className?: string,
  scrollable?: boolean,
  showHeading?: boolean,
};

export default function ContentListView({
  cols,
  data,
  showFolder,
  showFile,
  className,
  scrollable = true,
  showHeading = true,
}: Readonly<FileListViewProps>) {
  const gridTemplateColumns = cols.map((c) => colDivisions[c]).join(' ');

  return (
    <div className={className ?? "flex flex-col h-full w-full select-none overflow-hidden"}>
      {showHeading && (
        <div
          className={`grid gap-x-2 h-12 border-2 border-b-surface0 border-t-transparent border-l-transparent border-r-transparent font-bold shrink-0`}
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
      )}
      <div className={`w-full ${scrollable ? "w-full flex-1 overflow-y-auto min-h-0" : "w-full flex flex-col"}`}>
      {
        data.map((f) => (
          <div
            key={f.id}
            className="grid gap-x-2 h-12 border-b-2 border-surface0 hover:bg-overlay0/30"
            style={{ gridTemplateColumns }}
            onDoubleClick={f.type == "folder" ? () => showFolder(f.id): () => showFile(f.id)}
          >
            {
              cols.map((col) => rowBuilder[col].body(f, col))
            }
          </div>
        ))
      }
      </div>
    </div>
  );
}
