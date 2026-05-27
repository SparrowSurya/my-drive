import React, { useMemo } from "react";
import usePageView from "@/hooks/usePageView";
import Modal, { ModalProps } from "@/components/modal";
import { ContentData } from "../../types";
import { ContentOption, OptionBuilder } from "./types";


export type ContentOptionMenuType = {
  data: ContentData;
} & Omit<ModalProps, "children">;

export default function ContentOptionMenuDialog({
  data,
  className,
  ...props
}: Readonly<ContentOptionMenuType>) {
  const page = usePageView();

  const options = useMemo(() => {
    if (page === "trash") {
      return [
        ContentOption.restore,
        ContentOption.deleteForever,
      ];
    }

    return [
      ContentOption.download,
      ContentOption.rename,
      ContentOption.seperator,
      ContentOption.organise,
      ContentOption.share,
      ContentOption.moveToTrash,
    ];
  }, [page]);

  return (
    <Modal className={`option-menu ${className}`} {...props}>
      {options.map((opt) => (
        <React.Fragment key={opt.toString()}>
          { OptionBuilder[opt]({ data }) }
        </React.Fragment>
      ))}
    </Modal>
  );
}
