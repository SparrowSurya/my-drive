"use client";

import { useFetch } from "@/hooks/useFetch";
import Icon from "../../icon";
import { faClose, faDownload } from "@fortawesome/free-solid-svg-icons";
import FileIcon from "../fileIcon";
import { FileType } from "@/lib/types/file";
import mime from "@/lib/mime";
import TextPreview from "./text";
import NonePreview from "./none";
import ImagePreview from "./image";
import AudioPreview from "./audio";
import VideoPreview from "./video";
import PdfPreview from "./pdf";

export type FilePreviewProps = {
  id: number,
  close: () => void;
};

type FileDataResponse = {
  id: number,
  name: string,
  type: Exclude<FileType, "folder">,
  size: string,
  folderId: number,
  mimeType: string,
  data: string,
  lastModified: string,
  owner: string,
};

export default function FilePreview({ id, close }: Readonly<FilePreviewProps>) {
  const url = `/api/file/${id}`;
  const { loading, error, data } = useFetch<FileDataResponse>(url);

  const category = data ? mime.resolveCategory(data.mimeType) : "unknown";

  const render = () => {
    if (loading) return <span className="text-blue animate-pulse text-xl font-medium">Loading preview...</span>;
    if (error) return <span className="text-red text-xl font-medium">Failed to load: {error.message}</span>;
    if (!data) return null;

    switch (category) {
      case "text":
        return <TextPreview data={data.data} />;
      case "image":
        return <ImagePreview data={data.data} mimeType={data.mimeType} />;
      case "audio":
        return <AudioPreview data={data.data} mimeType={data.mimeType} name={data.name} />;
      case "video":
        return <VideoPreview data={data.data} mimeType={data.mimeType} />;
      case "pdf":
        return <PdfPreview data={data.data} />;
      default:
        return <NonePreview id={data.id} name={data.name} type={data.type} size={data.size} />;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-crust/95 fixed inset-0 z-[100]" autoFocus>
      <div className="flex flex-row justify-between items-center h-16 px-6 py-3 w-full bg-base border-b border-surface1 shrink-0">
        <div className="flex flex-row items-center">
          <Icon icon={faClose} hover className="text-xl px-2 cursor-pointer mr-2" onClick={close} />
          {data && (
            <div className="flex flex-row gap-3 ml-3 text-lg font-medium items-center">
              <FileIcon type={data.type} className="size-6" />
              <span className="text-text truncate max-w-md" title={data.name}>{data.name}</span>
            </div>
          )}
        </div>
        {data && (
          <div className="flex flex-row gap-6 items-center">
            <span className="text-subtext0 text-sm font-medium">{data.size}</span>
            <a href={`/api/download/${data.id}`} download={data.name} className="flex items-center">
              <Icon icon={faDownload} hover className="cursor-pointer text-lg" />
            </a>
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        {render()}
      </div>
    </div>
  );
}
