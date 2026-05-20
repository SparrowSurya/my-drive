"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { faDownload, faEllipsisVertical, faFolderOpen, faPencil, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import type { ContentData } from "../types";
import { OptionMenu, Option } from "@/components/option";
import FolderRenameDialog from "./folderRenameDialog";
import FileRenameDialog from "./fileRenameDialog";
import useDownload from "@/hooks/useDownload";


export default function FileOption({ row }: Readonly<{ row: ContentData }>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  const [showFolderRenameDialog, setShowFolderRenameDialog] = useState<boolean>(false);
  const [showFileRenameDialog, setShowFileRenameDialog] = useState<boolean>(false);
  const { downloadFile, downloadFolder } = useDownload();
  
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showOptionMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.right - 256 // w-64 is 256px
      });
    }
  }, [showOptionMenu]);

  function handleDownload() {
    if (row.type == "folder") {
      return downloadFolder(row.id, row.name);
    }
    return downloadFile(row.id, row.name);
  };

  const options: (Option | null)[] = [
    {
      leading: <Icon icon={faDownload} />,
      label: "Download",
      props: {
        onClick() {
          handleDownload();
          setShowOptionMenu(false);
        }
      }
    },
    {
      leading: <Icon icon={faPencil} />,
      label: "Rename",
      props: {
        onClick() {
          setShowOptionMenu(false);
          if (row.type === "folder") {
            setShowFolderRenameDialog(true);
          } else {
            setShowFileRenameDialog(true);
          }
        }
      }
    },
    null,
    {
      leading: <Icon icon={faFolderOpen} />,
      label: "Organise",
    },
    {
      leading: <Icon icon={faUserPlus} />,
      label: "Share",
    },
    {
      leading: <Icon icon={faTrash} />,
      label: "Move to Trash",
    },
  ];

  return (
    <div className="relative w-7 flex items-center justify-center" ref={buttonRef}>
      {
        showOptionMenu && (
          <OptionMenu
            portal="id_dialog"
            onClickOutside={() => setShowOptionMenu(false)}
            className="fixed shadow-2xl"
            style={{ 
              top: menuPos.top,
              left: menuPos.left,
              zIndex: 1000001
            }}
            options={options}
          />
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
      <Icon hover icon={faEllipsisVertical} className="cursor-pointer" onClick={() => setShowOptionMenu(!showOptionMenu)} />
    </div>
  );
}
