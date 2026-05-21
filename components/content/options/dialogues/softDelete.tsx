"use client";

import type { ContentData } from "../../types";


export type ConfirmSoftDeleteDialogProps = {
  data: ContentData,
  closeModal: (refresh: boolean) => void,
};

export default function SoftDeleteDialog({ data, closeModal }: Readonly<ConfirmSoftDeleteDialogProps>) {
  return (
    <div
      className="fixed inset-0 bg-crust/60 z-50 flex items-center justify-center"
      onClick={() => closeModal(false)}
    >
      <div
        className="rounded-3xl p-8 bg-surface0 shadow-2xl shadow-crust w-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-text mb-2">Move to Trash</h3>
          <p className="text-subtext0 mb-8">
            <span className="font-medium text-text">{`"${data.name}"`}</span> {data.type} will be deleted permanently after 30 days
          </p>
          <div className="flex flex-row justify-end items-center gap-4">
            <button
              type="button"
              onClick={() => closeModal(false)}
              className="px-6 py-2 rounded-full text-lavender font-semibold hover:bg-lavender/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => closeModal(true) /* TODO */}
              className="px-6 py-2 rounded-full bg-lavender text-base font-semibold hover:bg-lavender/90 transition-all"
            >
              Move to Trash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
