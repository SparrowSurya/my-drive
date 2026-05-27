"use client";

import { useState, useRef, useEffect } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import type { ContentData } from "../types";
import ContentOptionMenuDialog from "./items";


export default function ContentOptionMenu({ data }: Readonly<{ data: ContentData }>) {
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top?: number, bottom?: number, left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (showOptionMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;
      const menuWidth = 256;

      const left = Math.max(8, Math.min(rect.right - menuWidth, vw - menuWidth - 8));

      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setMenuPos({
          bottom: vh - rect.top + 8,
          left,
        });
      } else {
        setMenuPos({
          top: rect.bottom + 8,
          left,
        });
      }
    }
  }, [showOptionMenu]);

  return (
    <div className="relative w-7 flex items-center justify-center" ref={buttonRef}>
      <Icon hover icon={faEllipsisVertical} className="cursor-pointer" onClick={() => setShowOptionMenu(!showOptionMenu)} />
      {
        showOptionMenu && (
          <ContentOptionMenuDialog
            data={data}
            onClickOutside={() => setShowOptionMenu(false)}
            className="fixed shadow-2xl"
            style={{
              top: menuPos.top,
              bottom: menuPos.bottom,
              left: menuPos.left,
              zIndex: 1000001
            }}
          />
        )
      }
    </div>
  );
}
