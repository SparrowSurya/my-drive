"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import useModal from "@/hooks/useModal";
import SoftDeleteDialog from "../dialogues/softDelete";
import { ContentData } from "../../types";


export default function MoveToTrashOption({ data }: Readonly<{ data: ContentData }>) {
  const modal = useModal();

  const closeModal = (refresh: boolean = true) => {
    modal.close(refresh);
  };

  const handleRename = () => {
    modal.show(<SoftDeleteDialog data={data} closeModal={closeModal} />);
  };

  return (
    <div className="option-item" onClick={handleRename}>
      <Icon icon={faTrash} className="option-item-icon" />
      <span className="option-item-text">Move to Trash</span>
    </div>
  );
}
