"use client";

import EmptyState from "@/components/emptyState";
import { ContentListView, ContentGridView } from "@/components/content";
import { ListViewColumns } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";
import ContentDropZone from "./dropzone";
import useShowContent from "@/hooks/useShowContent";
import useContentView from "@/hooks/useContentView";
import { usePathname } from "next/navigation";


const columns: ListViewColumns[] = ["name", "owner", "lastModified", "fileSize", "elipsis"];

export type ContentViewProps = {
  data: ContentData[],
};

export default function ContentView({ data }: Readonly<ContentViewProps>) {
  const path = usePathname();
  const { showFolder, showFile } = useShowContent();
  const { gridView } = useContentView();
  const isMyDrive = path == '/drive/my-drive';

  return (
    <>
      <ContentDropZone>
        {
          (data === null || data.length == 0) && (
            isMyDrive
            ? <EmptyState
                image='/assets/svg/empty_state_my_drive.svg'
                title='A place for all of your files'
                para='Drag your files and folders here or use the "New" button to upload'
              />
            : <EmptyState
                image='/assets/svg/empty_state_empty_folder.svg'
                title='Drop files here'
                para='Or use the "New" button'
              />
          )
        }
        {
          data && data.length > 0 && (
            gridView
              ? <ContentGridView data={data} showFolder={showFolder} showFile={showFile} />
              : <ContentListView data={data} cols={columns} showFolder={showFolder} showFile={showFile} />
          )
        }
      </ContentDropZone>
      {
      }
    </>
  );
}
