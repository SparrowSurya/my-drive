"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { faDownload, faEllipsisVertical, faFolderOpen, faPencil, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import type { RowData } from "../types";
import { OptionMenu, Option } from "@/components/option";
import FolderRenameDialog from "./folderRenameDialog";
import FileRenameDialog from "./fileRenameDialog";


export default function FileOption({ row }: Readonly<{ row: RowData }>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  const [showFolderRenameDialog, setShowFolderRenameDialog] = useState<boolean>(false);
  const [showFileRenameDialog, setShowFileRenameDialog] = useState<boolean>(false);

  function handleDownload() {
    const a = document.createElement("a");
    const isFolder = row.type === "folder";
    a.href = `/api/download/${isFolder ? "folder" : "file"}/${row.id}`;
    a.download = row.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    <div className="relative w-12">
      {
        showOptionMenu && (
          <OptionMenu
            onClickOutside={() => setShowOptionMenu(false)}
            className="absolute top-[36] right-[18]"
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
      <Icon hover icon={faEllipsisVertical} onClick={() => setShowOptionMenu(!showOptionMenu)} />
    </div>
  );
}