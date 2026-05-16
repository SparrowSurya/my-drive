"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { faAngleRight, faEllipsis, faFolder } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { OptionMenu, Option } from "@/components/option";


export type SegmentData = {
  name: string,
  url: string,
};

export type BreadcrumbsProps = {
  data: SegmentData[],
} & React.HTMLAttributes<HTMLDivElement>;

export default function Breadcrumbs({ data, className, ...props }: Readonly<BreadcrumbsProps>) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const index = Math.max(0, data.length-3);
  const initial = data.slice(0, index);
  const last3 = data.slice(index);

  const options: Option[] = initial.map((segment) => ({
    leading: <Icon icon={faFolder} className="mx-4" />,
    label: segment.name,
    props: {
      onClick() {
        router.push(segment.url)
      }
    }
  }));

  return (
    <div className={`flex flex-row items-center ml-3 ${className ?? ""}`} {...props}>
      {
        (initial.length > 0) && (
          <>
            {
              showMenu && (
                <OptionMenu
                  className="absolute top-10.5"
                  onClickOutside={() => setShowMenu(false)}
                  options={options}
                />
              )
            }
            <Icon
              icon={faEllipsis}
              hover
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-4 h-2"
            />
            <Icon
              icon={faAngleRight}
              className="text-subtext1 cursor-default"
              style={{ fontSize: "medium" }}
            />
          </>
        )
      }
      {
        last3.map((segment, index) => (
          <React.Fragment key={index}>
            {
              (index !== 0) && <Icon icon={faAngleRight} className="text-subtext1 cursor-default" style={{ fontSize: "medium" }} />
            }
            <Link href={ segment.url } className="drivePageHeading text-button">
              { segment.name }
            </Link>
          </React.Fragment>
        ))
      }
    </div>
  );
}