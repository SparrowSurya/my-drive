"use client";

import React, { useState } from "react";
import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { OptionMenu, type Option } from "@/components/option";


export type MenuButtonProps = {
  label: string;
  selectedLabel?: string | null;
  options: (Option | null)[];
  onClear?: () => void;
  leadingIcon?: React.ReactNode;
  className?: string;
};

export default function MenuButton({
  label,
  selectedLabel,
  options,
  onClear,
  leadingIcon,
  className,
}: Readonly<MenuButtonProps>) {
  const [showOptionMenu, setShowOptionMenu] = useState(false);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className={`flex flex-row items-center rounded-md cursor-pointer transition-all duration-200 overflow-hidden h-9 ${
          selectedLabel
            ? "bg-lavender text-base"
            : "border border-surface1 text-text hover:bg-surface0"
        }`}
        onClick={() => setShowOptionMenu(!showOptionMenu)}
      >
        <div className="flex flex-row items-center gap-2 h-full">
          {!selectedLabel && leadingIcon}
          <span className="font-medium whitespace-nowrap text-sm ml-3">{selectedLabel ?? label}</span>
          <Icon icon={faCaretDown} className="text-xs ml-1" />
        </div>

        {selectedLabel && (
          <div
            className="flex items-center justify-center px-2 h-full border-l border-base hover:bg-base/10"
            onClick={(e) => {
              e.stopPropagation();
              if (onClear) onClear();
              setShowOptionMenu(false);
            }}
          >
            <Icon icon={faXmark} className="text-sm" />
          </div>
        )}
      </div>

      {showOptionMenu && (
        <OptionMenu
          onClickOutside={() => setShowOptionMenu(false)}
          onClick={() => setShowOptionMenu(false)}
          className="absolute top-11 left-0"
          options={options}
        />
      )}
    </div>
  );
}
