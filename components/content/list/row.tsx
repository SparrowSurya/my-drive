"use client";

import { Avatar } from "@/components/avatar";
import FileOption from "../components/fileOptions";
import FileIcon from "../fileIcon";
import { type ContentData } from "../types";
import { type ListViewRow } from "./types";
import { type FileType } from "@/lib/types/file";


const rowBuilder: ListViewRow = {
  "name": {
    head: "Name",
    body: (row: ContentData, key: string) => {
      return (
        <div  key={key} className="flex flex-row items-center truncate">
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
        <div key={key} className="flex flex-row items-center">
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
        <div key={key} className="flex flex-row items-center">
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
        <div key={key} className="flex flex-row items-center">
          { row.reason ?? "—" }
        </div>
      );
    },
  },
  "owner": {
    head: "Owner",
    body: (row: ContentData, key: string) => {
      return (
        <div key={key} className="flex flex-row items-center gap-2">
          <Avatar
            text={row.owner}
            className={`bg-lavender text-base`}
            size="small"
          />
          <div className="max-w-30 truncate">{ row.owner }</div>
        </div>
      );
    },
  },
  "elipsis": {
    head: "",
    body: (row: ContentData, key: string) => {
      return (
        <div key={key} className="flex flex-row items-center mx-2 shrink-0">
          <FileOption row={row} />
        </div>
      );
    },
  },
};

export default rowBuilder;
