"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top?: number, bottom?: number, left: number }>({ top: 0, left: 0 });

  const index = Math.max(0, data.length - 3);
  const initial = data.slice(0, index);
  const last3 = data.slice(index);

  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;
      const menuMaxHeight = vh * 0.4;
      
      if (spaceBelow < menuMaxHeight && spaceAbove > spaceBelow) {
        setMenuPos({
          bottom: vh - rect.top + 4,
          left: rect.left,
        });
      } else {
        setMenuPos({
          top: rect.bottom + 4,
          left: rect.left,
        });
      }
    }
  }, [showMenu]);

  const options: Option[] = initial.map((segment) => ({
    leading: <Icon icon={faFolder} className="mx-4" />,
    label: segment.name,
    props: {
      onClick() {
        router.push(segment.url);
        setShowMenu(false);
      }
    }
  }));

  return (
    <div className={`flex flex-row items-center ${className ?? ""}`} {...props}>
      {
        (initial.length > 0) && (
          <div className="flex flex-row items-center" ref={buttonRef}>
            {
              showMenu && (
                <OptionMenu
                  portal="id_dialog"
                  onClickOutside={() => setShowMenu(false)}
                  className="fixed shadow-2xl overflow-y-auto"
                  style={{
                    top: menuPos.top,
                    bottom: menuPos.bottom,
                    left: menuPos.left,
                    maxHeight: "40vh",
                    zIndex: 1000001
                  }}
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
          </div>
        )
      }
      {
        last3.map((segment, index) => (
          <React.Fragment key={index}>
            {
              (index !== 0) && <Icon icon={faAngleRight} className="text-subtext1 cursor-default" style={{ fontSize: "medium" }} />
            }
            <Link href={ segment.url } className="drivePageHeading text-button rounded-md">
              { segment.name }
            </Link>
          </React.Fragment>
        ))
      }
    </div>
  );
}