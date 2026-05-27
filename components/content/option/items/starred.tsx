"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Icon from "@/components/icon";
import { ContentData } from "../../types";
import { addFileStar, addFolderStar, removeFileStar, removeFolderStar } from "../actions";
import useSnackbar from "@/hooks/useSnackbar";


export default function StarredOption({ data }: Readonly<{ data: ContentData }>) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [isPending, startTransition] = useTransition();

  const isStarred = !!data.starred;
  const icon = isStarred ? faStarSolid : faStarRegular;
  const label = isStarred ? "Remove from starred" : "Add to starred";

  const handleToggleStar = async () => {
    if (isPending || !data.id) return;

    let success = false;
    if (data.type === "file") {
      success = isStarred ? await removeFileStar(data.id) : await addFileStar(data.id);
    } else {
      success = isStarred ? await removeFolderStar(data.id) : await addFolderStar(data.id);
    }

    if (success) {
      const message = isStarred
        ? `Removed ${data.type} "${data.name}" from starred`
        : `Added ${data.type} "${data.name}" to starred`;
      snackbar.show({ message });
      startTransition(() => router.refresh());
    } else {
      snackbar.show({ message: "Something went wrong" });
    }
  };

  return (
    <div className="option-item" onClick={handleToggleStar}>
      <Icon icon={icon} className="option-item-icon" />
      <span className="option-item-text">{label}</span>
    </div>
  );
}
