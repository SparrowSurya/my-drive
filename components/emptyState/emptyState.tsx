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
    <div className={className ?? "emptyState"} {...props}>
      {
        (typeof image === "string") ? (
          <Image
            src={image}
            alt="empty state"
            width="240"
            height="240"
            className={"emptyStateImage"}
          />
        ) : image
      }
      {
        (typeof title === "string") ? (
          <div className={"emptyStateTitle"}>{ title }</div>
        ) : title
      }
      {
        para && (
          (typeof para === "string") ? (
            <div className={"emptyStatePara"}>{ para }</div>
          ) : para
        )
      }
    </div>
  );
}
