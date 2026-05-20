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
  const { showFolder, showFile } = useShowContent();

  return (
    <div className="flex flex-col flex-none">
      <div className="flex flex-row shrink-0 sticky top-0 bg-mantle z-20 py-1">
        <button
          className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
          onClick={() => setShow(!show)}
          >
          <Icon icon={show ? faCaretDown : faCaretRight}  />
          <span className="mx-3">Suggested folders</span>
        </button>
      </div>
      <div className={`ml-5 overflow-hidden flex flex-col transition-all duration-500 ease-in-out ${show ? 'max-h-500 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <ContentDropZone>
          <ContentGridView
            data={folders}
            showFolder={showFolder}
            showFile={showFile}
            scrollable={false}
          />
        </ContentDropZone>
      </div>
    </div>
  );
}
