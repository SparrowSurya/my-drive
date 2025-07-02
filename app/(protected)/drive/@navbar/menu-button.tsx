"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { faFileUpload, faFolderPlus, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import CreateFolderDialog from "./createFolderDialog";
import { OptionMenu, OptionItem, OptionSeperator } from "@/components/option";
import { uploadFiles, uploadFolder } from "./actions";


const iconClassName = "w-4 ml-4 mr-6";

export default function MenuButton() {
  const router = useRouter();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);

  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState<boolean>(false);

  useEffect(() => {
    if (folderUploadRef.current) {
      folderUploadRef.current.setAttribute("webkitdirectory", "");
    }
  }, []);

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
        await uploadFiles(fileData);
        startTransition(() => router.refresh());
      } catch (error) {
        console.log("Error:", error);
      }
    }
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  }

  async function handleFolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const fileData = await Promise.all(
        Array.from(files).map(async (file) => {
          const arrayBuf = await file.arrayBuffer();
          return {
            name: file.name,
            size: file.size,
            data: new Uint8Array(arrayBuf),
            path: file.webkitRelativePath,
          };
        })
      );
      try {
        await uploadFolder(fileData);
        startTransition(() => router.refresh());
      } catch (error) {
        console.log("Error:", error);
      }
    }
    if (folderUploadRef.current) {
      folderUploadRef.current.value = "";
    }
  }

  return (
    <>
      {
        showOptionMenu && (
          <OptionMenu
            onClickOutside={() => setShowOptionMenu(!showOptionMenu)}
            className="absolute bg-surface0 drop-shadow-md rounded-sm border-overlay0 drop-shadow-overlay0"
          >
            <OptionItem
              leading={<Icon icon={faFolderPlus} className={iconClassName} />}
              text="New Folder"
              onClick={() => {
                setShowCreateFolderDialog(true);
                setShowOptionMenu(false);
              }}
            />
            <OptionSeperator />
            <OptionItem
              leading={<Icon icon={faFileUpload} className={iconClassName} />}
              text="File Upload"
              onClick={() => {
                fileUploadRef.current?.click();
                setTimeout(() => setShowOptionMenu(false), 0);
              }}
            />
            <OptionItem
              leading={<Icon icon={faUpload} className={iconClassName} />}
              text="Folder Upload"
              onClick={() => {
                folderUploadRef.current?.click();
                setTimeout(() => setShowOptionMenu(false), 0);
              }}
            />
          </OptionMenu>
        )
      }
      {
        showCreateFolderDialog && (
          <CreateFolderDialog
            closeModal={() => {
              setShowCreateFolderDialog(false);
              startTransition(() => router.refresh());
            }}
          />
        )
      }
      <button
        onClick={() => setShowOptionMenu(true)}
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
      <input
        ref={folderUploadRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFolderChange}
      />
    </>
  );
}
