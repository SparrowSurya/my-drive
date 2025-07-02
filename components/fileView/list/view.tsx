"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RowData } from "../types";
import type { Column } from "./types";


export type ListViewProps = {
  data: RowData[],
  columns: Column<RowData>[],
} & React.HTMLAttributes<HTMLTableElement>;

export default function FileListView({ data, columns, ...props }: Readonly<ListViewProps>) {
  const router = useRouter();

  return (
    <table {...props}>
      <thead>
        <tr className="text-left">
          {
            columns.map((col) => (
              <th key={col.key} className="h-12 border-b-2 border-surface0 font-bold">
                {col.heading}
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((row: RowData) => (
            <tr
              key={`${row.type}-${row.id}`}
              className="h-12 border-b-2 border-surface0 cursor-pointer select-none hover:bg-surface1"
              onDoubleClick={() => {
                if (row.type === "folder") {
                  router.push(`/drive/folder/${row.id}`);
                }
              }}
            >
              { columns.map((col) => col.render(row, col.key)) }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
