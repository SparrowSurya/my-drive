"use client";

import { useEffect, useActionState } from "react";
import Dialog from "@/components/dialog";
import { Form, Input } from "@/components/form";
import { createFolderAction } from "./actions";
import { getFolderIdByPathname } from "./utils";
import { usePathname } from "next/navigation";

export default function CreateFolderDialog({
  closeModal,
}: Readonly<{
  closeModal: () => void,
}>) {
  const path  = usePathname();
  const folderId = getFolderIdByPathname(path);

  const [state, formAction, isSubmitting] = useActionState(createFolderAction, {
    parentId: folderId,
    folderName: "",
  });

  useEffect(() => {
    if (!!state.success) {
      closeModal();
    }
  }, [state.success, closeModal]);

  return (
    <Dialog className="py-5 px-8">
      <Form action={formAction} className="flex flex-col gap-3 w-60">
        <h3 className="text-2xl">Folder Name</h3>
        <input type="hidden" name="parentId" defaultValue={state.parentId} style={{ display: "none" }} />
        <Input
          required
          id="id_folder"
          name="folderName"
          placeholder="folder name"
          autoFocus={true}
          className="p-3 border-2 border-overlay0 focus:border-lavender rounded-lg outline-none"
          defaultValue={state.folderName}
          errorText={state.errors?.folderName?.[0]}
        />
        <div className="flex flex-row justify-end items-center gap-3">
          <button type="button" disabled={isSubmitting} onClick={() => closeModal()} className="text-button">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="text-button">Create</button>
        </div>
      </Form>
    </Dialog>
  );
}