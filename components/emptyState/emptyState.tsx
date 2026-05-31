"use client";

import React from "react";
import Image from "next/image";
import { EmptyStateData, emptyStates } from "./constants";
import { PageView, PageViewType } from "@/contexts/pageView";
import usePageView from "@/hooks/usePageView";


export type EmptyStateProps = {
  data?: EmptyStateData;
  isFiltered?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;


export default function EmptyState({ data, isFiltered, className, ...props }: Readonly<EmptyStateProps>) {
  const page = usePageView();
  const pageKey = !!isFiltered ? PageView.search as PageViewType : page;
  if (!pageKey) return null;

  const { image, title, para } = data ?? emptyStates[pageKey];

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
