"use client";

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import useDownload from "@/hooks/useDownload";
import { ContentData } from "../../types";


export default function DownloadOption({ data }: Readonly<{ data: ContentData }>) {
  const { downloadFile, downloadFolder } = useDownload();

  const handleDownload = () => {
    if (typeof data.id !== "number" || typeof data.name !== "string") {
      console.log(`Failed to download ${data.type}: invalid ID=${data.id} or name=${data.name}`);
      return;
    }
    if (data.type == "folder") {
      return downloadFolder(data.id, data.name);
    }
    return downloadFile(data.id, data.name);
  };

  return (
    <div className="option-item" onClick={handleDownload}>
      <Icon icon={faDownload} className="option-item-icon" />
      <span className="option-item-text">Download</span>
    </div>
  );
}
