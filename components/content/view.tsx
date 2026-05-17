"use client";

import EmptyState from "@/components/emptyState";
import { ContentListView, ContentGridView } from "@/components/content";
import row from "@/components/content/list/row";
import { ListViewColumns } from "@/components/content/list/types";
import { ContentData } from "@/components/content/types";
import ContentDropZone from "./dropzone";
import useShowContent from "@/hooks/useShowContent";


const columns: ListViewColumns[] = ["name", "lastModified", "fileSize", "elipsis"];

export type ContentViewProps = {
  data: ContentData[],
  gridView: boolean,
};

export default function ContentView({ data, gridView }: Readonly<ContentViewProps>) {
  const { showFolder } = useShowContent();

  return (
    <ContentDropZone>
      {
        (data === null || data.length == 0) && (
          <EmptyState
            image="/assets/svg/empty_state_my_drive.svg"
            title="A place for all of your files"
            para="Drag your files and folders here or use the 'New' button to upload"
          />
        )
      }
      {
        data && data.length > 0 && (
          gridView
            ? <ContentGridView data={data} showFolder={showFolder} />
            : <ContentListView data={data} rows={row} cols={columns} showFolder={showFolder} />
        )
      }
    </ContentDropZone>
  );
}
