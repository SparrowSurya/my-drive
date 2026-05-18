"use client";

import { Avatar } from "@/components/avatar";
import FileOption from "../components/fileOptions";
import FileIcon from "../fileIcon";
import { type ContentData } from "../types";
import { type ListViewRow } from "./types";
import { type FileType } from "@/lib/types/file";


const row: ListViewRow = {
  "name": {
    head: "Name",
    body: (row: ContentData, key: string) => {
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
    body: (row: ContentData, key: string) => {
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
    body: (row: ContentData, key: string) => {
      return (
        <div key={key} className="listColumn_fileSize">
          <span className="ml-2">
            { row.size ?? "—" }
          </span>
        </div>
      );
    },
  },
  "reason": {
    head: "Reason",
    body: (row: ContentData, key: string) => {
      return (
        <div key={key} className="listColumn_reason">
          { row.reason ?? "—" }
        </div>
      );
    },
  },
  "owner": {
    head: "Owner",
    body: (row: ContentData, key: string) => {
      const alphabet = row.owner?.charAt(0).toUpperCase() ?? '';
      return (
        <div key={key} className="listColumn_owner">
          <Avatar
            char={alphabet}
            className={`bg-peach text-base`}
            size="medium"
          />
        </div>
      );
    },
  },
  "elipsis": {
    head: "",
    body: (row: ContentData, key: string) => {
      return (
        <div key={key} className="listColumn_elipsis">
          <FileOption row={row} />
        </div>
      );
    },
  },
};

export default row;
