"use client";

import { useState } from "react";
import { faDownload, faEllipsisVertical, faFolderOpen, faPencil, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import Modal from "@/components/modal";
import type { RowData } from "../types";


export default function FileOption({ row }: Readonly<{ row: RowData }>) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <td className="relative w-12">
      {
        isModalOpen && (
          <Modal
            onClickOutside={() => setIsModalOpen(false)}
            className="absolute top-[36] right-[18] bg-surface0 drop-shadow-md rounded-sm border-overlay0 drop-shadow-overlay0 z-[100]"
          >
            <div className="flex flex-col gap-0 my-2 w-60">

              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
                <Icon icon={faDownload} className="mx-4 w-8" />
                <span className="text-subtext1">Download</span>
              </div>

              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
                <Icon icon={faPencil} className="mx-4 w-8" />
                <span className="text-subtext1">Rename</span>
              </div>

              <div className="py-2">
                <hr className="border-overlay0" />
              </div>

              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
                <Icon icon={faFolderOpen} className="mx-4 w-8" />
                <span className="text-subtext1">Oragnise</span>
              </div>

              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
                <Icon icon={faUserPlus} className="mx-4 w-8" />
                <span className="text-subtext1">Share</span>
              </div>

              <div className="py-2">
                <hr className="border-overlay0" />
              </div>

              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
                <Icon icon={faTrash} className="mx-4 w-8" />
                <span className="text-subtext1">Trash</span>
              </div>

            </div>
          </Modal>
        )
      }
      <Icon
        hover
        icon={faEllipsisVertical}
        onClick={() => setIsModalOpen(!isModalOpen)}
      />
    </td>
  );
}