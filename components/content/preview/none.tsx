"use client";

import React from "react";
import FileIcon from "../fileIcon";
import { FileType } from "@/lib/types/file";

export type NonePreviewProps = {
  id: number;
  name: string;
  type: Exclude<FileType, "folder">;
  size: string;
};

export default function NonePreview({ id, name, type, size }: Readonly<NonePreviewProps>) {
  return (
    <div className="p-12 rounded-2xl border border-surface1 flex flex-col items-center gap-10 bg-surface0 max-w-lg w-full">
      <div className="flex flex-col items-center gap-2">
        <span className="text-text/80 text-center text-2xl font-medium">Preview not available</span>
      </div>
      <div className="flex flex-row items-center gap-4 min-w-0">
        <FileIcon type={type} className="h-36 shrink-0" />
        <div className="flex flex-col justify-between h-12 min-w-0 py-0.5">
          <span className="text-text font-medium text-xl truncate leading-none" title={name}>
            {name}
          </span>
          <span className="text-subtext0 text-sm font-normal leading-none">
            {size}
          </span>
        </div>
      </div>
      <a
        href={`/api/download/${id}`}
        className="px-8 py-2.5 bg-blue text-crust text-sm font-bold rounded-full hover:bg-blue/90 transition-colors"
        download={name}
      >
        Download
      </a>
    </div>
  );
}
