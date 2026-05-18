import React from "react";

type AvatarCharProps = {
  text?: string,
  size: "small" | "medium" | "large",
  className?: string,
  style?: React.CSSProperties,
} & React.HTMLAttributes<HTMLDivElement>;

const sizes = {
  small: "size-[28] text-md",
  medium: "size-[36] text-2xl",
  large: "size-[86] text-7xl",
};

export default function Avatar({ text, size, className, style, ...restProps }: Readonly<AvatarCharProps>) {
  const char = text?.charAt(0).toUpperCase() ?? '?';

  return (
    <div
      className={`${className} ${sizes[size]} font-bold flex justify-center items-center rounded-full cursor-pointer`}
      style={style}
      {...restProps}
    >{ char }</div>
  );
}
