"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/dialog";
import { Form, Input } from "@/components/form";
import { createFolderAction } from "./actions";


export default function CreateFolderModal({
  closeModal,
}: Readonly<{
  closeModal: () => void,
}>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars

  const [error, setError] = useState<string | undefined>(undefined);

  async function handleCreateFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { folderName } = Object.fromEntries(formData.entries());

    if (folderName.toString().trim() === "") {
      setError("Folder name is required");
      return;
    }

    const [ok, value_or_err] = await createFolderAction(folderName.toString().trim());
    if (ok) {
      closeModal();
      startTransition(() => router.refresh());
    } else {
      setError(value_or_err);
    }
  }

  return (
    <Dialog className="py-5 px-8">
      <Form onSubmit={handleCreateFolder} className="flex flex-col gap-3 w-60">
        <h3 className="text-2xl">Folder Name</h3>
        <Input
          required
          id="id_folder"
          name="folderName"
          placeholder="folder name"
          autoFocus={true}
          className="p-3 border-2 border-overlay0 focus:border-lavender rounded-lg outline-none"
          errorText={error}
        />
        <div className="flex flex-row justify-end items-center gap-3">
          <button type="button" onClick={() => closeModal()} className="text-button">Cancel</button>
          <button type="submit" className="text-button">Create</button>
        </div>
      </Form>
    </Dialog>
  );
}