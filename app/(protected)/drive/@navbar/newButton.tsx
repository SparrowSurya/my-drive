"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter, } from "next/navigation";
import { faFileUpload, faFolderPlus, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import CreateFolderDialog from "./createFolderDialog";
import { OptionMenu, Option } from "@/components/option";
import useFileUpload from "@/hooks/useFileUpload";
import { FileWithRelativePath } from "@/hooks/useDropzone";
import useModal from "@/hooks/useModal";


export default function MenuButton() {
  const router = useRouter();
  const modal = useModal();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);

  const { uploadFile } = useFileUpload();

  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);

  useEffect(() => {
    if (folderUploadRef.current) {
      folderUploadRef.current.setAttribute("webkitdirectory", "");
    }
  }, []);

  const closeOptionMenu = () => setShowOptionMenu(false);

  const closeModal = (refresh: boolean = true) => {
    modal.close();
    if (refresh) {
      startTransition(() => router.refresh())
    }
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        (file as FileWithRelativePath).relativePath = file.name;
        uploadFile(file as FileWithRelativePath);
      });
    }
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  }

  async function handleFolderUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        (file as FileWithRelativePath).relativePath = file.webkitRelativePath;
        uploadFile(file as FileWithRelativePath);
      });
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
          closeOptionMenu();
          modal.show(<CreateFolderDialog closeModal={closeModal} />);
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
          setTimeout(closeOptionMenu, 0);
        }
      }
    },
    {
      leading: <Icon icon={faUpload} />,
      label: "Folder Upload",
      props: {
        onClick() {
          folderUploadRef.current?.click();
          setTimeout(closeOptionMenu, 0);
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
      <button
        onClick={() => setShowOptionMenu(true)}
        className="flex flex-rpw justify-center items-center bg-lavender text-base hover:bg-lavender/95 rounded-lg cursor-pointer p-2"
        >
        <Icon icon={faPlus} className="size-[16] cursor-pointer ml-1 mr-2 rounded-full" />
        <span className="text-lg pr-2">New</span>
      </button>
      <input ref={fileUploadRef} type="file" multiple style={{ display: "none" }} onChange={handleFileUpload} />
      <input ref={folderUploadRef} type="file" multiple style={{ display: "none" }} onChange={handleFolderUpload} />
    </>
  );
}
