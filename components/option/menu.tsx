import React from "react";
import Modal, { type ModalProps } from "@/components/modal";


export type OptionMenuProps = ModalProps & React.HTMLAttributes<HTMLDivElement>;

export default function OptionMenu({ children, onClickOutside, className, ...props }: Readonly<OptionMenuProps>) {
  return (
    <Modal onClickOutside={onClickOutside} className={`option-menu ${className}`} {...props}>
      { children }
    </Modal>
  );
}