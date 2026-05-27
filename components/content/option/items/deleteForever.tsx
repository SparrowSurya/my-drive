"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { ContentData } from "../../types";


export default function DeleteForeverOption({ }: Readonly<{ data: ContentData }>) {
  return (
    <div className="option-item" onClick={undefined}>
      <Icon icon={faTrash} className="option-item-icon" />
      <span className="option-item-text">Delete forever</span>
    </div>
  );
}
