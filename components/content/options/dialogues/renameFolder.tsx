"use client";

import { useEffect, useActionState } from "react";
import { Form, Input } from "@/components/form";
import { FolderRenameAction } from "../actions";
import type { ContentData } from "../../types";
import useSnackbar from "@/hooks/useSnackbar";


export type RenameFolderDialogProps = {
  data: ContentData,
  closeModal: (refresh: boolean) => void,
};

export default function RenameFolderDialog({ data, closeModal }: Readonly<RenameFolderDialogProps>) {
  const snackbar = useSnackbar();
  const [state, formAction, isSubmitting] = useActionState(FolderRenameAction, {
    folderName: data.name,
    folderId: data.id,
  });

  useEffect(() => {
    if (!!state.success) {
      closeModal(true);
      snackbar.show({
        message: state.message ?? `Renamed folder "${data.name}" to "${state.folderName}"`,
      });
    }
  }, [state.success, closeModal, state.message, state.folderName, snackbar, data.name]);

  const customFormAction = (payload: FormData): void => {
    const folderName = payload.get('folderName');
    if (folderName !== data.name) {
      return formAction(payload);
    }
    closeModal(false);
  };

  return (
    <div
      className="fixed inset-0 bg-crust/60 z-50 flex items-center justify-center"
      onClick={() => closeModal(false)}
    >
      <div
        className="rounded-3xl p-8 bg-surface0 shadow-2xl shadow-crust w-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Form action={customFormAction} className="flex flex-col">
          <h3 className="text-2xl font-semibold text-text mb-6">Rename Folder</h3>
          <input type="hidden" name="folderId" defaultValue={state.folderId} />
          <Input
            required
            id="id_folder"
            name="folderName"
            placeholder="Folder name"
            autoFocus={true}
            className="w-full p-3 mb-8 bg-base border-2 border-surface1 focus:border-lavender rounded-xl outline-none text-text transition-all"
            defaultValue={state.folderName}
            errorText={state.errors?.folderName?.[0]}
          />
          <div className="flex flex-row justify-end items-center gap-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => closeModal(false)}
              className="px-6 py-2 rounded-full text-lavender font-semibold hover:bg-lavender/10 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-full bg-lavender text-base font-semibold hover:bg-lavender/90 transition-all disabled:opacity-50"
            >
              Rename
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
