"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "../icon";
import { useState } from "react";
import NewButtonMenuDialog from "./items";


export default function NewButton() {
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);

  const handleClick = () => {
    setTimeout(() => setShowOptionMenu(!showOptionMenu), 0);
  };

  return (
    <>
      <button
        onClick={() => setShowOptionMenu(true)}
        className="flex flex-rpw justify-center items-center bg-lavender text-base hover:bg-lavender/95 rounded-lg cursor-pointer p-2"
        >
        <Icon icon={faPlus} className="size-[16] cursor-pointer ml-1 mr-2 rounded-full" />
        <span className="text-md pr-2">New</span>
      </button>
      {showOptionMenu && (
        <NewButtonMenuDialog
          onClickOutside={() => setShowOptionMenu(!showOptionMenu)}
          onClick={handleClick}
          className="absolute"
        />
      )}
    </>
  );
}
