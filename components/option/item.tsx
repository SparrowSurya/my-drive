import React from "react";


export type OptionItemProps = {
  leading?: string | React.ReactNode,
  text: string,
  trailing?: string | React.ReactNode,
} & React.HTMLAttributes<HTMLDivElement>;


export default function OptionItem({ leading, text, trailing, className, ...restProps }: Readonly<OptionItemProps>) {
  return (
    <div className={`option-item ${className}`} {...restProps}>
      {
        leading && ((typeof leading === "string") ? (
            <span className="option-item-leading">{ leading }</span>
          ) : leading)
      }
      {
        (typeof text === "string") ? (
          <span className="option-item-text">{ text }</span>
        ) : text
      }
      {
        trailing && ((typeof trailing === "string") ? (
          <span className="option-item-trailing">{ trailing }</span>
        ) : trailing)
      }
    </div>
  );
}
