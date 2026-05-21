"use client";

import { useActionState, useEffect } from "react";
import { Form } from "@/components/form";
import { FileSoftDeleteAction } from "../actions";
import type { ContentData } from "../../types";
import useSnackbar from "@/hooks/useSnackbar";


export type ConfirmSoftDeleteDialogProps = {
  data: ContentData,
  closeModal: (refresh: boolean) => void,
};

export default function SoftDeleteDialog({ data, closeModal }: Readonly<ConfirmSoftDeleteDialogProps>) {
  const snackbar = useSnackbar();
  const [state, formAction, isSubmitting] = useActionState(FileSoftDeleteAction, {
    fileId: data.id,
  });

  useEffect(() => {
    if (!!state.success) {
      snackbar.show({
        message: state.message ?? `File "${data.name}" sent to trash`,
      });
      closeModal(true);
    }
  }, [state.success, closeModal, snackbar, data.name, state.message]);

  return (
    <div
      className="fixed inset-0 bg-crust/60 z-50 flex items-center justify-center"
      onClick={() => closeModal(false)}
    >
      <div
        className="rounded-3xl p-8 bg-surface0 shadow-2xl shadow-crust w-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Form action={formAction} className="flex flex-col">
          <h3 className="text-2xl font-semibold text-text mb-2">Move to Trash</h3>
          <p className="text-subtext0 mb-8">
            <span className="font-medium text-text">{`"${data.name}"`}</span> {data.type} will be deleted permanently after 30 days
          </p>
          <input type="hidden" name="fileId" value={data.id} />
          <div className="flex flex-row justify-end items-center gap-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => closeModal(false)}
              className="px-6 py-2 rounded-full text-lavender font-semibold hover:bg-lavender/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-full bg-lavender text-base font-semibold hover:bg-lavender/90 transition-all"
            >
              Move to Trash
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
