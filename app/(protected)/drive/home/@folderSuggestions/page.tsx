"use client";

import { useState } from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { FolderData } from "@/components/content/types";
import { ContentGridView } from "@/components/content";
import useShowContent from "@/hooks/useShowContent";
import ContentDropZone from "@/components/content/dropzone";


export type FolderSuggestionsProps = {
  folders: FolderData[],
};

export default function FolderSuggestions({ folders }: Readonly<FolderSuggestionsProps>) {
  const [show, setShow] = useState<boolean>(true);
  const { showFolder } = useShowContent();

  return (
    <>
      <button
        className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
        onClick={() => setShow(!show)}
      >
        <Icon icon={show ? faCaretDown : faCaretRight}  />
        <span className="mx-3">Suggested folders</span>
      </button>
      {show && (
        <div className="mx-5 my-4">
          <ContentDropZone>
            <ContentGridView data={folders} showFolder={showFolder} />
          </ContentDropZone>
        </div>
      )}
    </>
  );
}
