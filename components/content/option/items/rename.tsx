"use client";

import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import useModal from "@/hooks/useModal";
import { ContentData } from "../../types";
import RenameFolderDialog from "../dialogues/renameFolder";
import RenameFileDialog from "../dialogues/renameFile";


export default function RenameOption({ data }: Readonly<{ data: ContentData }>) {
  const modal = useModal();

  const closeModal = (refresh: boolean = true) => {
    modal.close(refresh);
  };

  const handleRename = () => {
    if (data.type === "folder") {
      modal.show(<RenameFolderDialog data={data} closeModal={closeModal} />);
    } else {
      modal.show(<RenameFileDialog data={data} closeModal={closeModal} />);
    }
  };

  return (
    <div className="option-item" onClick={handleRename}>
      <Icon icon={faPencil} className="option-item-icon" />
      <span className="option-item-text">Rename</span>
    </div>
  );
}
