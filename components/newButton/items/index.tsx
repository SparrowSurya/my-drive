import React from "react";
import Modal, { ModalProps } from "@/components/modal";
import NewFolderOption from "./newFolder";
import OptionSeperator, { OptionSeperatorProps } from "@/components/option/seperator";
import UploadFileOption from "./uploadFile";
import UploadFolderOption from "./uploadFolder";


export type NewButtonMenuDialogProps = {
  seperatorProps?: OptionSeperatorProps;
} & Omit<ModalProps, "children">;

export default function NewButtonMenuDialog({ className, seperatorProps, ...props }: Readonly<NewButtonMenuDialogProps>) {
  return (
    <Modal className={`option-menu ${className}`} {...props}>
      <NewFolderOption />
      <OptionSeperator {...seperatorProps} />
      <UploadFileOption />
      <UploadFolderOption />
    </Modal>
  );
}