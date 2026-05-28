"use client";

import React from "react";
import { ContentData } from "../types";
import { listColumnTemplate, type ListViewColumn } from "./types";
import columnRenderer from "./columns";
import useSort, { SortOption } from "@/hooks/useSort";


export type FileListViewProps = {
  cols: ListViewColumn[],
  data: ContentData[],
  showFolder: (id?: number) => void,
  showFile: (id?: number) => void,
  className?: string,
  scrollable?: boolean,
  showHeading?: boolean,
  headings?: Partial<Record<ListViewColumn, string>>,
  internalSort?: boolean,
  sortOptionProp?: SortOption | null,
  applySortProp?: (opt: SortOption | null) => void,
};


export default function ContentListView({
  cols,
  data,
  showFolder,
  showFile,
  className,
  scrollable = true,
  showHeading = true,
  headings = {},
  internalSort = true,
  applySortProp,
  sortOptionProp,
}: Readonly<FileListViewProps>) {
  const gridTemplateColumns = cols.map((c) => listColumnTemplate[c]).join(' ');
  const { sortedData, sortOption, applySort } = useSort({ data });
  const updatedData =  internalSort
    ? [
        ...sortedData.filter((f) => f.type === "folder"),
        ...sortedData.filter((f) => f.type === "file"),
      ]
    : data;

  const headingProps = {
    headings,
    applySort: internalSort ? applySort : applySortProp,
    sortOption: internalSort ? sortOption : sortOptionProp,
  };

  return (
    <div className={className ?? "flex flex-col h-full w-full select-none overflow-y-auto"}>
      {showHeading && (
        <div
          className={`grid gap-x-2 h-12 border-2 border-b-surface0 border-t-transparent border-l-transparent border-r-transparent font-bold shrink-0 sticky top-0 z-10 bg-mantle`}
          style={{ gridTemplateColumns }}
        >
          {
            cols.map((col) =>
              columnRenderer[col].heading(col, headingProps)
            )
          }
        </div>
      )}
      <div className={`w-full ${scrollable ? "w-full flex-1 overflow-y-auto min-h-0" : "w-full flex flex-col"}`}>
      {
        updatedData.map((f) => (
          <div
            key={f.id}
            className="grid gap-x-2 h-12 border-b-2 border-surface0 hover:bg-overlay0/30"
            style={{ gridTemplateColumns }}
            onDoubleClick={f.type == "folder" ? () => showFolder(f.id): () => showFile(f.id)}
          >
            {
              cols.map((col) => columnRenderer[col].content(col, { data: f }))
            }
          </div>
        ))
      }
      </div>
    </div>
  );
}
