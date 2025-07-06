"use client";

import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import FileIcon from "../fileView/fileIcon";
import Icon from "../icon";
import { FileUpload } from "./types";
import { CircularProgress } from "../progress";


export type FileUploadItemProps = {
  file: FileUpload,
};

export default function FileUploadItem({ file }: Readonly<FileUploadItemProps>) {
  return (
    <div className="flex py-2">
      <FileIcon type={file.type} className={(file.status === "success") ? "opacity-100" : "opacity-75"} />
      <span
        className={`flex-1 truncate overflow-hidden whitespace-nowrap ${(file.status === "uploading") ? "text-subtext1/50" : "text-text"} ${(file.status === "error") && "line-through"}`}
      >
        { file.name }
      </span>
      {
        (file.status === "success") ? (
          <Icon icon={faCheckCircle} className="text-green mx-4" />
        ) : (file.status === "error") ? (
          <Icon icon={faXmarkCircle} className="text-maroon mx-4" />
        ) : (
          <CircularProgress
            progress={file.progress}
            size={20}
            strokeWidth={3}
            color="#74C7EC"
            trackColor="#7F849C"
            className="flex justify-center items-center mx-5"
          />
        )
      }
    </div>
  );
}