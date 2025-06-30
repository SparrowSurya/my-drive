import React from "react";
import type { Column } from "./types";


export type ListViewProps<T> = {
  data: T[],
  columns: Column<T>[],
};

export default function FileListView<T>({ data, columns }: Readonly<ListViewProps<T>>) {
  return (
    <table className="w-full">
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
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="h-12 hover:bg-surface1 border-b-2 border-surface0 cursor-pointer">
              { columns.map((col) => col.render(row, col.key)) }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
