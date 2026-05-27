"use client";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { ContentData } from "../../types";


export default function ShareOption({ }: Readonly<{ data: ContentData }>) {
  return (
    <div className="option-item" onClick={undefined}>
      <Icon icon={faUserPlus} className="option-item-icon" />
      <span className="option-item-text">Share</span>
    </div>
  );
}
