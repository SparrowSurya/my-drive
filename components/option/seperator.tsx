import React from "react";

export type OptionSeperatorProps = React.HTMLAttributes<HTMLHRElement>;

export default function OptionSeperator({ className, ...props }: Readonly<OptionSeperatorProps>) {
  return (
    <hr className={`option-seperator ${className}`} {...props} />
  );
}