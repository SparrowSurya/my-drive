"use client";

import { useEffect, useActionState } from "react";
import Modal from "@/components/modal";
import { Form, Input } from "@/components/form";
import { FolderRenameAction } from "./actions";
import type { RowData } from "../types";


export type RenameFolderDialogProps = {
  data: RowData,
  closeModal: () => void,
};

export default function RenameFolderDialog({ data, closeModal }: Readonly<RenameFolderDialogProps>) {
  const [state, formAction, isSubmitting] = useActionState(FolderRenameAction, {
    folderName: data.name,
    folderId: data.id,
  });

  useEffect(() => {
    if (!!state.success) {
      closeModal();
    }
  }, [state.success, closeModal]);

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-crust/60">
      <Modal
        className="absolute left-[50%] top-[50%] rounded-2xl py-5 px-8 bg-surface0 shadow-md shadow-crust"
        portal="id_modal"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <Form action={formAction} className="flex flex-col gap-3 w-60">
          <h3 className="text-2xl">Rename Folder</h3>
          <input type="hidden" name="folderId" defaultValue={state.folderId} />
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
            <button type="submit" disabled={isSubmitting} className="text-button">Rename</button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}