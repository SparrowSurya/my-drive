import React from "react";

type AvatarCharProps = {
  char: string,
  size: "small" | "medium" | "large",
  className?: string,
  style?: React.CSSProperties,
} & React.HTMLAttributes<HTMLDivElement>;

const sizes = {
  small: "size-[24] text-md",
  medium: "size-[36] text-2xl",
  large: "size-[86] text-7xl",
};

export default function Avatar({ char, size, className, style, ...restProps }: Readonly<AvatarCharProps>) {
  return (
    <div
      className={`${className} ${sizes[size]} font-bold flex justify-center items-center rounded-full cursor-pointer`}
      style={style}
      {...restProps}
    >{ char }</div>
  );
}
