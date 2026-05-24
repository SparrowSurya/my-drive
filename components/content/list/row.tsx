"use client";

import { Avatar } from "@/components/avatar";
import ContentOptionMenu from "../options";
import FileIcon from "../fileIcon";
import { type ContentData } from "../types";
import { type ListViewRow } from "./types";
import Icon from "@/components/icon";
import { faFolder, faHardDrive } from "@fortawesome/free-solid-svg-icons";
import utils from "@/lib/utils";


const rowBuilder: ListViewRow = {
  "name": {
    head: "Name",
    body: (data: ContentData, key: string) => {
      return (
        <div  key={key} className="flex flex-row items-center truncate">
          <FileIcon mimeType={data.type === "file" ? data.mimeType : undefined} />
          <span className="truncate overflow-hidden whitespace-nowrap">{ data.name }</span>
        </div>
      );
    },
  },
  "reason": {
    head: "Reason",
    body: (data: ContentData, key: string) => {
      return (
        <div key={key} className="flex flex-row items-center">
          { data.reason ?? "—" }
        </div>
      );
    },
  },
  "owner": {
    head: "Owner",
    body: (data: ContentData, key: string) => {
      return (
        <div key={key} className="flex flex-row items-center gap-2">
          <Avatar
            text={data.owner}
            className={`bg-lavender text-base`}
            size="small"
          />
          <div className="max-w-30 truncate">{ data.isMe ? 'me' : data.owner }</div>
        </div>
      );
    },
  },
  "lastModified": {
    head: "Last modified",
    body: (data: ContentData, key: string) => {
      const lastModified = data.updatedAt instanceof Date
        ? utils.formatDate(data.updatedAt)
        : "—";

      return (
        <div key={key} className="flex flex-row items-center">
          <span className="ml-2">{ lastModified }</span>
        </div>
      );
    },
  },
  "dateTrashed": {
    head: "Date trashed",
    body: (data: ContentData, key: string) => {
      const dateTrashed = data.deletedAt instanceof Date
        ? utils.formatDate(data.deletedAt)
        : "—";

      return (
        <div key={key} className="flex flex-row items-center">
          <span className="ml-2">{ dateTrashed }</span>
        </div>
      );
    },
  },
  "fileSize": {
    head: "File size",
    body: (data: ContentData, key: string) => {
      const size = typeof data.size === "number"
        ? utils.formatBytes(data.size)
        : "—";

      return (
        <div key={key} className="flex flex-row items-center">
          <span className="ml-2">{ size }</span>
        </div>
      );
    },
  },
  "location": {
    head: "Location",
    body: (data: ContentData, key: string) => {
      return (
        <div key={key} className="flex flex-row items-center">
          <Icon icon={!!data.parent ? faFolder : faHardDrive} />
          <span className="ml-2 truncate">{!!data.parent ? data.parent : "My Drive"}</span>
        </div>
      );
    },
  },
  "elipsis": {
    head: "",
    body: (data: ContentData, key: string) => {
      return (
        <div key={key} className="flex flex-row items-center mx-2 shrink-0">
          <ContentOptionMenu data={data} />
        </div>
      );
    },
  },
};

export default rowBuilder;
