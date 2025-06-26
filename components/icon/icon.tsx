import React from "react";
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IconProp as FaIconProp } from "@fortawesome/fontawesome-svg-core";

export type IconProp = {
  icon: FaIconProp,
} & Omit<FontAwesomeIconProps, "icon">;

export default function IconButton({ icon, ...restProps }: Readonly<IconProp>) {
  return (
    <FontAwesomeIcon
      icon={icon}
      style={{ fontSize: "18px" }}
      {...restProps}
    />
  );
}
