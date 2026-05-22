"use client";

import { ContentData } from "../../types";

export type OrganiseContentDialogProps = {
  data: ContentData,
  closeModal: (refresh: boolean) => void;
};

export type ChildFolder = {
  id: number,
  name: string,
  updatedAt: Date,
};

export default function OrganiseContentDialog({ data, closeModal }: Readonly<OrganiseContentDialogProps>) {
  return (
    <div className="fixed inset-0 bg-crust/60 z-50 flex items-center justify-center" onClick={() => closeModal(false)}>
      <div className="flex flex-col gap-2 bg-base">
        <div className="">Move { `"${data.name}"` }</div>
        <div className="">Breadcrumb</div>
        <div className="">Files</div>
      </div>
    </div>
  );
}