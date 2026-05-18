import React from "react";

export type OptionSeperatorProps = React.HTMLAttributes<HTMLHRElement>;

export default function OptionSeperator({ className, ...props }: Readonly<OptionSeperatorProps>) {
  return (
    <hr className={`border-overlay0 my-2 ${className ?? ""}`} {...props} />
  );
}