"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { faFileUpload, faFolderPlus, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import CreateFolderDialog from "./createFolderDialog";
import { OptionMenu, Option } from "@/components/option";
import { uploadFiles, uploadFolder } from "./actions";
import utils from "@/lib/utils";


export default function MenuButton() {
  const router = useRouter();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);

  const path = usePathname();
  const folderId = utils.getFolderIdByPathname(path);

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
        await uploadFiles(folderId, fileData);
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
        await uploadFolder(folderId, fileData);
        startTransition(() => router.refresh());
      } catch (error) {
        console.log("Error:", error);
      }
    }
    if (folderUploadRef.current) {
      folderUploadRef.current.value = "";
    }
  }

  const options: (Option | null)[] = [
    {
      leading: <Icon icon={faFolderPlus} />,
      label: "New Folder",
      props: {
        onClick() {
          setShowCreateFolderDialog(true);
          setShowOptionMenu(false);
        }
      }
    },
    null,
    {
      leading: <Icon icon={faFileUpload} />,
      label: "File Upload",
      props: {
        onClick() {
          fileUploadRef.current?.click();
          setTimeout(() => setShowOptionMenu(false), 0);
        }
      }
    },
    {
      leading: <Icon icon={faUpload} />,
      label: "Folder Upload",
      props: {
        onClick() {
          folderUploadRef.current?.click();
          setTimeout(() => setShowOptionMenu(false), 0);
        }
      }
    },
  ];

  return (
    <>
      {
        showOptionMenu && (
          <OptionMenu
            onClickOutside={() => setShowOptionMenu(!showOptionMenu)}
            className="absolute"
            options={options}
          />
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
        <Icon icon={faPlus} className="size-[16] cursor-pointer ml-1 mr-2 rounded-full" />
        <span className="text-lg pr-2">New</span>
      </button>
      <input ref={fileUploadRef} type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />
      <input ref={folderUploadRef} type="file" multiple style={{ display: "none" }} onChange={handleFolderChange} />
    </>
  );
}
