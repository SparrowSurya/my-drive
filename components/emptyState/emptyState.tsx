import React from "react";
import Image from "next/image";
import style from "./emptyState.module.css";


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
    <div className={className ?? style.emptyState} {...props}>
      {
        (typeof image === "string") ? (
          <Image
            src={image}
            alt="empty state"
            width="240"
            height="240"
            className={style.emptyStateImage}
          />
        ) : image
      }
      {
        (typeof title === "string") ? (
          <div className={style.emptyStateTitle}>{ title }</div>
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
