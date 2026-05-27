"use client";

import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { ContentData } from "../../types";
import { restoreDeletedFile } from "../actions";
import useSnackbar from "@/hooks/useSnackbar";
import { useRouter } from "next/navigation";
import { useTransition } from "react";


export default function RestoreOption({ data }: Readonly<{ data: ContentData }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTransition, startTransition] = useTransition();
  const router = useRouter();
  const snackbar = useSnackbar();

  const handleRestore = async () => {
    if (!!data.id) {
      const success = await restoreDeletedFile(data.id);
      const message = success
        ? `Restored ${data.type} "${data.name}"`
        : `Failed to restore ${data.type} "${data.name}`;
      snackbar.show({ message });
      if (success) startTransition(() => router.refresh());
    } else {
      console.error(`Tried to delete ${data.type} with invalid ID=${data.id}`);
    }
  };

  return (
    <div className="option-item" onClick={handleRestore}>
      <Icon icon={faRefresh} className="option-item-icon" />
      <span className="option-item-text">Restore</span>
    </div>
  );
}
