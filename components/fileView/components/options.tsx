"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { faDownload, faEllipsisVertical, faFolderOpen, faPencil, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import type { RowData } from "../types";
import { OptionMenu, OptionItem, OptionSeperator} from "@/components/option";
import FolderRenameDialog from "./folderRenameDialog";
import FileRenameDialog from "./fileRenameDialog";


const iconClassName = "w-4 ml-4 mr-6";

export default function FileOption({ row }: Readonly<{ row: RowData }>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  const [showFolderRenameDialog, setShowFolderRenameDialog] = useState<boolean>(false);
  const [showFileRenameDialog, setShowFileRenameDialog] = useState<boolean>(false);

  return (
    <td className="relative w-12">
      {
        showOptionMenu && (
          <OptionMenu
            onClickOutside={() => setShowOptionMenu(false)}
            className="absolute top-[36] right-[18] bg-surface0 drop-shadow-md rounded-sm cursor-default border-overlay0 drop-shadow-overlay0"
          >
            <OptionItem
              leading={<Icon icon={faDownload} className={iconClassName} />}
              text="Download"
            />
            <OptionItem
              leading={<Icon icon={faPencil} className={iconClassName} />}
              text="Rename"
              onClick={() => {
                setShowOptionMenu(false);
                if (row.type === "folder") {
                  setShowFolderRenameDialog(true);
                } else {
                  setShowFileRenameDialog(true);
                }
              }}
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
              text="Move to trash"
            />
          </OptionMenu>
        )
      }
      {
        showFolderRenameDialog && (
          <FolderRenameDialog
            data={row}
            closeModal={() => {
              setShowFolderRenameDialog(false);
              startTransition(() => router.refresh());
            }}
          />
        )
      }
      {
        showFileRenameDialog && (
          <FileRenameDialog
            data={row}
            closeModal={() => {
              setShowFileRenameDialog(false);
              startTransition(() => router.refresh());
            }}
          />
        )
      }
      <Icon hover icon={faEllipsisVertical} onClick={() => setShowOptionMenu(!showOptionMenu)} />
    </td>
  );
}