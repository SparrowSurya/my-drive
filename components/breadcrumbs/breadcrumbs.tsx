import React from "react";
import Link from "next/link";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";


export type SegmentData = {
  name: string,
  url: string,
};

export type BreadcrumbsProps = {
  data: SegmentData[],
} & React.HTMLAttributes<HTMLDivElement>;

export default function Breadcrumbs({ data, className, ...props }: Readonly<BreadcrumbsProps>) {
  return (
    <div className={`flex flex-row items-center ${className}`} {...props}>
      {
        data.map((segment, index) => (
          <React.Fragment key={index}>
            {
              (index !== 0) && <Icon icon={faAngleRight} className="text-subtext1" style={{ fontSize: "medium" }} />
            }
            <Link href={ segment.url } className="text-button">
              { segment.name }
            </Link>
          </React.Fragment>
        ))
      }
    </div>
  );
}