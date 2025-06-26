import React from "react";

type TextButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function TextButton({ children, ...restProps }: Readonly<TextButtonProps>) {
  return (
    <button
      className="bg-transparent font-semibold text-lavender hover:bg-lavender/25 py-2 px-3 rounded-4xl"
      {...restProps}
    >{children}</button>
  );
}