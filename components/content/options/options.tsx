"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { faDownload, faEllipsisVertical, faFolderOpen, faPencil, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import type { ContentData } from "../types";
import { OptionMenu, Option } from "@/components/option";
import useDownload from "@/hooks/useDownload";
import RenameFileDialog from "./dialogues/renameFile";
import RenameFolderDialog from "./dialogues/renameFolder";
import SoftDeleteDialog from "./dialogues/softDelete";
import useModal from "@/hooks/useModal";
import OrganiseContentDialog from "./dialogues/organiseContent";


export type ContentOptionProps = {
  data: ContentData,
};

export default function ContentOption({ data }: Readonly<ContentOptionProps>) {
  const router = useRouter();
  const modal = useModal();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  const { downloadFile, downloadFolder } = useDownload();

  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showOptionMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.right - 256,
      });
    }
  }, [showOptionMenu]);

  const closeOptionMenu = () => setShowOptionMenu(false);

  const handleDownload = () => {
    if (typeof data.id !== "number" || typeof data.name !== "string") {
      console.log(`Failed to download ${data.type}: invalid ID=${data.id} or name=${data.name}`);
      return;
    }
    if (data.type == "folder") {
      return downloadFolder(data.id, data.name);
    }
    return downloadFile(data.id, data.name);
  };

  const closeModal = (refresh: boolean = true) => {
    modal.close();
    if (refresh) {
      startTransition(() => router.refresh());
    }
  };

  const options: (Option | null)[] = [
    {
      leading: <Icon icon={faDownload} />,
      label: "Download",
      props: {
        onClick() {
          closeOptionMenu();
          handleDownload();
        }
      }
    },
    {
      leading: <Icon icon={faPencil} />,
      label: "Rename",
      props: {
        onClick() {
          closeOptionMenu();
          if (data.type === "folder") {
            modal.show(<RenameFolderDialog data={data} closeModal={closeModal} />);
          } else {
            modal.show(<RenameFileDialog data={data} closeModal={closeModal} />);
          }
        }
      }
    },
    null,
    {
      leading: <Icon icon={faFolderOpen} />,
      label: "Organise",
      props: {
        onClick() {
          closeOptionMenu();
          modal.show(<OrganiseContentDialog data={data} closeModal={closeModal} />);
        }
      }
    },
    {
      leading: <Icon icon={faUserPlus} />,
      label: "Share",
    },
    {
      leading: <Icon icon={faTrash} />,
      label: "Move to Trash",
      props: {
        onClick() {
          closeOptionMenu();
          modal.show(<SoftDeleteDialog data={data} closeModal={closeModal} />);
        }
      },
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
      <Icon hover icon={faEllipsisVertical} className="cursor-pointer" onClick={() => setShowOptionMenu(!showOptionMenu)} />
    </div>
  );
}
