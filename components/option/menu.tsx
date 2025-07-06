import React from "react";
import Modal, { type ModalProps } from "@/components/modal";
import OptionItem from "./item";
import OptionSeperator from "./seperator";
import { Option } from "./types";


export type OptionMenuProps = {
  options: (Option | null)[]
} & Omit<ModalProps, "children"> & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export default function OptionMenu({ options, className, ...props }: Readonly<OptionMenuProps>) {
  return (
    <Modal className={`option-menu ${className}`} {...props}>
      {
        options.map((opt, index) => (
          opt ? (
            <OptionItem key={index} option={opt} {...opt.props} />
          ) : (
            <OptionSeperator key={index} />
          )
        ))
      }
    </Modal>
  );
}