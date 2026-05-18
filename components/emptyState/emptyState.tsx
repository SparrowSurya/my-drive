import React from "react";
import Image from "next/image";


export type EmptyStateProps = {
  image: string | React.ReactNode,
  title: string | React.ReactNode,
  para?: string | React.ReactNode,
} & React.HTMLAttributes<HTMLDivElement>;

export default function EmptyState({
  image,
  title,
  para,
  className,
  ...props
}: Readonly<EmptyStateProps>) {
  return (
    <div className={className ?? "flex flex-col justify-center items-center w-full h-full"} {...props}>
      {
        (typeof image === "string") ? (
          <Image
            src={image}
            alt="empty state"
            width="240"
            height="240"
          />
        ) : image
      }
      {
        (typeof title === "string") ? (
          <div className="text-xl mt-10">{ title }</div>
        ) : title
      }
      {
        para && (
          (typeof para === "string") ? (
            <div className="text-subtext0 mt-2">{ para }</div>
          ) : para
        )
      }
    </div>
  );
}
