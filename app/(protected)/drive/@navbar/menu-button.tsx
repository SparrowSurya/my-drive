"use client";

import React, { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { faFileUpload, faFolderPlus, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/modal";
import Icon from "@/components/icon";
import CreateFolderModal from "./createFolderModal";
import { uploadFilesAction } from "./actions";

export default function MenuButton() {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState<boolean>(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const fileData = await Promise.all(
          Array.from(files).map(async (file) => {
          const arrayBuf = await file.arrayBuffer();
          return {
            name: file.name,
            size: file.size,
            data: new Uint8Array(arrayBuf),
          };
        })
      );
      try {
        await uploadFilesAction(fileData);
        startTransition(() =>router.refresh());
      } catch (error) {
        console.log("Error:", error);
      }
    }
  }

  return (
    <>
      {
        isMenuOpen && (
          <Modal
            onClickOutside={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute bg-surface0 drop-shadow-sm rounded-sm border-overlay0 drop-shadow-overlay0"
          >
            <div className="flex flex-col gap-0 my-2 w-80">

              <div
                onClick={() => {
                  setIsCreateFolderModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer"
              >
                <Icon icon={faFolderPlus} className="mx-4 w-8" />
                <span className="text-subtext1">New Folder</span>
              </div>

              <div className="py-2">
                <hr className="border-overlay0" />
              </div>

              <div
                className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer"
                onClick={() => {
                  fileUploadRef.current?.click();
                  setTimeout(() => setIsMenuOpen(false), 0);
                }}
              >
                <Icon icon={faFileUpload} className="mx-4 w-8" />
                <span className="text-subtext1">File Upload</span>
              </div>

              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
                <Icon icon={faUpload} className="mx-4 w-8" />
                <span className="text-subtext1">Folder Upload</span>
              </div>

            </div>
          </Modal>
        )
      }
      {
        isCreateFolderModalOpen && <CreateFolderModal closeModal={() => setIsCreateFolderModalOpen(false)} />
      }
      <button
        onClick={() => setIsMenuOpen(true)}
        className="flex flex-rpw justify-center items-center bg-lavender text-base hover:bg-lavender/95 rounded-lg cursor-pointer p-2"
        >
        <Icon icon={faPlus} className="size-[16] cursor-pointer mx-2 rounded-full" />
        <span className="text-lg pr-2">New</span>
      </button>
      <input
        ref={fileUploadRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}