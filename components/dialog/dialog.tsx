"use client";

import { createPortal } from "react-dom";
import Modal, { type ModalProps } from "../modal";


export type DialogProps = ModalProps;

export default function Dialog({
  children,
  onClickOutside = () => {},
  ...props
}: Readonly<DialogProps>) {
  return createPortal(
    <div className="dialog">
      <Modal onClickOutside={onClickOutside} {...props} >
        { children }
      </Modal>
    </div>,
    document.getElementById("id_dialog")!,
  );
}
