"use client";

import Icon from "@/components/icon";
import useFileUpload from "@/hooks/useFileUpload";
import { faUpload } from "@fortawesome/free-solid-svg-icons";


export default function UploadFolderOption() {
  const { requestFolderUpload } = useFileUpload();

  return (
    <div className="option-item" onClick={requestFolderUpload}>
      <Icon icon={faUpload} className="option-item-icon" />
      <span className="option-item-text">Folder upload</span>
    </div>
  );
}