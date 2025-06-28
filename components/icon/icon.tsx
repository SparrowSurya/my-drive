import React from "react";
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";


export type IconProp = {
  hover?: boolean,
} & FontAwesomeIconProps;


export default function Icon({ hover, className, ...restProps }: Readonly<IconProp>) {
  return (
    <FontAwesomeIcon
      className={`icon ${hover && "icon-button"} ${className}`}
      {...restProps}
    />
  );
}
