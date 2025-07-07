"use client";

import FileOption from "../components/options";
import FileIcon from "../fileIcon";
import { type RowData } from "../types";
import { type ListViewRow } from "./types";
import { type FileType } from "@/lib/types/file";


const row: ListViewRow = {
  "name": {
    head: "Name",
    body: (row: RowData, key: string) => {
      return (
        <div  key={key} className="listColumn_name">
          <FileIcon type={row.type as FileType} />
          <span className="truncate overflow-hidden whitespace-nowrap">{ row.name }</span>
        </div>
      );
    },
  },
  "lastModified": {
    head: "Last modified",
    body: (row: RowData, key: string) => {
      return (
        <div key={key} className="listColumn_lastModified">
          <span className="ml-2">
            { row.lastModified }
          </span>
        </div>
      );
    },
  },
  "fileSize": {
    head: "File size",
    body: (row: RowData, key: string) => {
      return (
        <div key={key} className="listColumn_fileSize">
          <span className="ml-2">
            { row.size ?? "—" }
          </span>
        </div>
      );
    },
  },
  "elipsis": {
    head: "",
    body: (row: RowData, key: string) => {
      return (
        <div key={key} className="listColumn_elipsis">
          <FileOption row={row} />
        </div>
      );
    },
  },
};

export default row;
