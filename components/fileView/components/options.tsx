"use client";

import { useState } from "react";
import { faDownload, faEllipsisVertical, faFolderOpen, faPencil, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import type { RowData } from "../types";
import { OptionMenu, OptionItem, OptionSeperator} from "@/components/option";


const iconClassName = "w-4 ml-4 mr-6";

export default function FileOption({ row }: Readonly<{ row: RowData }>) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);

  return (
    <td className="relative w-12">
      {
        showOptionMenu && (
          <OptionMenu
            onClickOutside={() => setShowOptionMenu(false)}
            className="absolute top-[36] right-[18] bg-surface0 drop-shadow-md rounded-sm border-overlay0 drop-shadow-overlay0"
          >
            <OptionItem
              leading={<Icon icon={faDownload} className={iconClassName} />}
              text="Download"
            />
            <OptionItem
              leading={<Icon icon={faPencil} className={iconClassName} />}
              text="Rename"
            />
            <OptionSeperator />
            <OptionItem
              leading={<Icon icon={faFolderOpen} className={iconClassName} />}
              text="Organise"
            />
            <OptionItem
              leading={<Icon icon={faUserPlus} className={iconClassName} />}
              text="Share"
            />
            <OptionSeperator />
            <OptionItem
              leading={<Icon icon={faTrash} className={iconClassName} />}
              text="Move to bin"
            />
          </OptionMenu>
        )
      }
      <Icon hover icon={faEllipsisVertical} onClick={() => setShowOptionMenu(!showOptionMenu)} />
    </td>
  );
}