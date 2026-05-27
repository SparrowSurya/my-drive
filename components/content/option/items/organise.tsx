"use client";

import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import useModal from "@/hooks/useModal";
import Icon from "@/components/icon";
import { ContentData } from "../../types";
import OrganiseContentDialog from "../dialogues/organiseContent";


export default function OrganiseOption({ data }: Readonly<{ data: ContentData }>) {
  const modal = useModal();

  const closeModal = (refresh: boolean = true) => {
    modal.close(refresh);
  };

  const handleOrganise = () => {
    modal.show(<OrganiseContentDialog data={data} closeModal={closeModal} />);
  };

  return (
    <div className="option-item" onClick={handleOrganise}>
      <Icon icon={faFolderOpen} className="option-item-icon" />
      <span className="option-item-text">Organise</span>
    </div>
  );
}
