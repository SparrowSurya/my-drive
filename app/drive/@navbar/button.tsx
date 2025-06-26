"use client";

import React, { useState } from "react";
import { faFileUpload, faFolderPlus, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Folder } from "@/app/generated/prisma";
import Modal from "@/components/modal";
import { Icon } from "@/components/icon";
import { Form, Input } from "@/components/form";
import { TextButton } from "@/components/button";

export default function AddButton({
  createFolder,
}: Readonly<{
  createFolder: (name: string) => Promise<Folder | null>,
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);

  async function handleCreateFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { folderName } = Object.fromEntries(formData.entries());
    await createFolder(folderName.toString());
    setIsFileModalOpen(false);
  }

  return (
    <>
      {
        isMenuOpen && (
          <Modal
            onClickOutside={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute bg-surface0 drop-shadow-md rounded-sm drop-shadow-surface0"
          >
            <div className="flex flex-col gap-0 my-2 w-80 drop-shadow-overlay2">
              <div
                onClick={() => { setIsFileModalOpen(true); setIsMenuOpen(false); }}
                className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer"
              >
                <Icon icon={faFolderPlus} className="mx-4 w-8" />
                <span className="text-subtext1">New Folder</span>
              </div>
              <div className="py-2">
                <hr className="border-overlay0" />
              </div>
              <div className="h-8 flex flex-row items-center hover:bg-overlay0 cursor-pointer">
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
        isFileModalOpen && (
          <Modal
            onClickOutside={() => setIsFileModalOpen(false)}
            className="bg-surface0 w-80 px-8 py-5 rounded-2xl"
            style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}
          >
            <Form onSubmit={handleCreateFolder} className="flex flex-col gap-3">
              <h3 className="text-2xl">Folder Name</h3>
              <Input id="id_folder" required name="folderName" className="p-3 border-2 border-overlay0 focus:border-lavender rounded-lg outline-none" />
              <div className="flex flex-row justify-end items-center gap-3">
                <TextButton type="button">Cancel</TextButton>
                <TextButton type="submit">Create</TextButton>
              </div>
            </Form>
          </Modal>
        )
      }
      <button
        onClick={() => setIsMenuOpen(true)}
        className="flex flex-rpw justify-center items-center bg-lavender text-base hover:bg-lavender/95 rounded-lg cursor-pointer p-2"
        >
        <Icon icon={faPlus} className="size-[16] cursor-pointer mx-2 rounded-full" />
        <span className="text-lg pr-2">New</span>
      </button>
    </>
  );
}