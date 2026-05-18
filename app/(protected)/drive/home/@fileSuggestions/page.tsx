"use client";

import { useState } from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { ContentGridView, ContentListView } from "@/components/content";
import { FileData } from "@/components/content/types";
import useContentView from "@/hooks/useContentView";
import { ListViewColumns } from "@/components/content/list/types";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import useShowContent from "@/hooks/useShowContent";
import row from "@/components/content/list/row";

const headings: ListViewColumns[] = [
  "name",
  "reason",
  "owner",
  "elipsis",
];

export type FileSuggestionsProps = {
  files: FileData[],
};

export default function FileSuggestions({ files }: Readonly<FileSuggestionsProps>) {
  const [show, setShow] = useState<boolean>(true);
  const { showFolder } = useShowContent();
  const { gridView } = useContentView();

  return (
    <>
      <div className="flex flex-row justify-between">
        <button
          className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
          onClick={() => setShow(!show)}
        >
          <Icon icon={show ? faCaretDown : faCaretRight}  />
          <span className="mx-3">Suggested files</span>
        </button>
        {show && <ContentViewToggleButton visible={files.length > 0} />}
      </div>
      {show && (
        <div className="mx-5 overflow-y-scroll">
          { gridView
              ? <ContentGridView data={files} showFolder={showFolder} />
              : <ContentListView rows={row} cols={headings} data={files} showFolder={showFolder} />
          }
          <button
            className="flex flex-row gap-4 rounded-4xl px-5 py-1 my-4 font-semibold text-blue hover:bg-blue/25"
          >View more</button>
        </div>
      )}
    </>
  );
}
