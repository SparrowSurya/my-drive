import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp as FaIconProp } from "@fortawesome/fontawesome-svg-core";

export type IconProp = {
  icon: FaIconProp,
  hover?: boolean,
} & React.HTMLAttributes<HTMLDivElement>;

export default function IconButton({ icon, ...restProps }: Readonly<IconProp>) {
  return (
    <div
      className="size-[32] p-[8] flex justify-center items-center cursor-pointer rounded-full hover:bg-overlay0"
      {...restProps}
    >
      <FontAwesomeIcon
        icon={icon}
        style={{ fontSize: "18px" }}
      />
    </div>
  );
}
