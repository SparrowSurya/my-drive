"use client";

import Icon from "@/components/icon";
import useModal from "@/hooks/useModal";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import CreateFolderDialog from "../dialogs/createFolder";


export default function NewFolderOption() {
  const modal = useModal();

  const handleCreateFoler = () => {
    modal.show(<CreateFolderDialog closeModal={modal.close} />);
  };

  return (
    <div className="option-item" onClick={handleCreateFoler}>
      <Icon icon={faFolderPlus} className="option-item-icon" />
      <span className="option-item-text">New Folder</span>
    </div>
  );
}