import React from "react";
import { Option } from "./types";


export type OptionItemProps = {
  option: Option,
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export default function OptionItem({ option, className, ...restProps }: Readonly<OptionItemProps>) {
  return (
    <div className={className ?? "option-item"} {...restProps}>
      { option.leading ?? null }
      {
        (typeof option.label === "string") ? (
          <span className="option-item-text">{ option.label }</span>
        ) : option.label
      }
      {
        option.trailing && (typeof option.trailing === "string") ? (
          <span className="option-item-trailing">{ option.trailing }</span>
        ) : option.trailing
      }
    </div>
  );
}
