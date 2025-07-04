"use client";

import FileOption from "../components/options";
import FileIcon from "../fileIcon";
import { RowData, FileType } from "../types";
import { ListViewRow } from "./types";


const row: ListViewRow = {
  "name": {
    head: "Name",
    body: (row: RowData, key: string) => {
      return (
        <div  key={key} className="fileColumn_name">
          <FileIcon type={row.type as FileType} />
          <span className="select-none">{ row.name }</span>
        </div>
      );
    },
  },
  "lastModified": {
    head: "Last modified",
    body: (row: RowData, key: string) => {
      return (
        <div key={key} className="fileColumn_lastModified">
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
        <div key={key} className="fileColumn_fileSize">
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
        <div key={key} className="fileColumn_elipsis">
          <FileOption row={row} />
        </div>
      );
    },
  },
};

export default row;
