"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import useModal from "@/hooks/useModal";
import FileSoftDeleteDialog from "../dialogues/softDeleteFile";
import { ContentData } from "../../types";
import FolderSoftDeleteDialog from "../dialogues/softDeleteFolder";


export default function MoveToTrashOption({ data }: Readonly<{ data: ContentData }>) {
  const modal = useModal();

  const closeModal = (refresh: boolean = true) => {
    modal.close(refresh);
  };

  const handleRename = () => {
    if (data.type === "file") {
      modal.show(<FileSoftDeleteDialog data={data} closeModal={closeModal} />);
    } else if (data.type === "folder") {
      modal.show(<FolderSoftDeleteDialog data={data} closeModal={closeModal} />);
    }
  };

  return (
    <div className="option-item" onClick={handleRename}>
      <Icon icon={faTrash} className="option-item-icon" />
      <span className="option-item-text">Move to Trash</span>
    </div>
  );
}
