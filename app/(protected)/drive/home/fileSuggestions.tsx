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
  const [viewMore, setViewMore] = useState(false);
  const [show, setShow] = useState<boolean>(true);
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();

  const lessCount = 12;
  const visibleFiles = viewMore ? files : files.slice(0, Math.min(files.length, lessCount));

  return (
    <div className="flex flex-col flex-none">
      <div className="flex flex-row justify-between shrink-0 sticky top-0 bg-mantle z-20 py-1">
        <button
          className="flex flex-row items-center rounded-4xl px-3 py-1 font-medium hover:text-blue hover:bg-blue/25"
          onClick={() => setShow(!show)}
        >
          <Icon icon={show ? faCaretDown : faCaretRight}  />
          <span className="mx-3">Suggested files</span>
        </button>
        {show && <ContentViewToggleButton visible={files.length > 0} />}
      </div>
      <div className={`ml-5 overflow-hidden flex flex-col transition-all duration-500 ease-in-out ${show ? 'max-h-1250 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        { gridView
            ? <ContentGridView
                data={visibleFiles}
                showFolder={showFolder}
                showFile={showFile}
                scrollable={false}
              />
            : <ContentListView
                cols={headings}
                data={visibleFiles}
                showFolder={showFolder}
                showFile={showFile}
                scrollable={false}
              />
        }
        {(files.length > lessCount) && (
          <button
            className="flex flex-row gap-4 rounded-4xl px-5 mr-auto py-1 my-4 font-semibold text-blue hover:bg-blue/25 shrink-0"
            onClick={() => setViewMore(!viewMore)}
          >
            { viewMore ? "View less" : "View more"}
          </button>
        )}
      </div>
    </div>
  );
}
