"use client";

import Icon from "@/components/icon";
import useFileUpload from "@/hooks/useFileUpload";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";


export default function UploadFileOption() {
  const { requestFileUpload } = useFileUpload();

  return (
    <div className="option-item" onClick={requestFileUpload}>
      <Icon icon={faFileUpload} className="option-item-icon" />
      <span className="option-item-text">File upload</span>
    </div>
  );
}