"use client";

import { useMemo, useState } from "react";
import { faAngleUp, faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import Modal, { type ModalProps } from "@/components/modal";
import FileUploadItem from "./fileUploadItem";
import { FileUpload } from "./types";


export type FileUploadToastProps = {
  uploads: FileUpload[],
  onClose: () => void,
} &Omit<ModalProps, "children">;

export default function FileUploadToast({ uploads, onClose, ...props }: Readonly<FileUploadToastProps>) {
  const [showDetail, setShowDetail] = useState(true);
  const uploadCount = useMemo(() => {
    return uploads.filter(item => item.progress === 100).length;
  }, [uploads]);

  return (
    <Modal {...props}>
      <div className="bg-crust rounded-lg w-80 select-none overflow-clip shadow-md shadow-crust">
        <div className="flex flex-row gap-2 px-3 py-2">
          <span className="flex-1 font-semibold">
            {
              (uploads.length === uploadCount) ? (
                `${uploads.length} uploads complete`
              ) : (uploads.length > 0) ? (
                `${uploadCount}/${uploads.length}  upload${(uploads.length > 1) ? "s" : ""} complete`
              ) : "uploading ..."
            }
          </span>
          <Icon icon={showDetail ? faAngleDown : faAngleUp} hover onClick={() => setShowDetail(!showDetail)} />
          <Icon
            icon={faXmark}
            hover
            onClick={() => onClose()}
          />
        </div>
        {
          showDetail && (
            <div className="bg-base">
              {
                uploads.map((file, index) => (
                  <FileUploadItem key={index} file={file} />
                ))
              }
            </div>
          )
        }
      </div>
    </Modal>
  );
}
