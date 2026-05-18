import React from "react";
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";


export type IconProp = {
  hover?: boolean,
} & FontAwesomeIconProps;


export default function Icon({ hover, className, ...restProps }: Readonly<IconProp>) {
  return (
    <FontAwesomeIcon
      className={`size-[16] p-[6] ${hover && "cursor-pointer rounded-full hover:bg-overlay0/50"} ${className ?? ""}`}
      {...restProps}
    />
  );
}
