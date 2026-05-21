import { Metadata } from "next";
import { EmptyStateProps } from "@/components/emptyState";
import { getRecentFilesData } from "./query";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import GroupedContentView from "@/components/content/groupedView";
import { ListViewColumns } from "@/components/content/list/types";


export const metadata: Metadata = {
  title: "Recent - Drive",
};

export default async function RecentPage() {
  const data = await getRecentFilesData();
  const isEmpty = Object.keys(data).length == 0;

  const emptyStateProps: EmptyStateProps = {
    image: "/assets/svg/empty_state_recent.svg",
    title: "No recent files",
    para: "See all the files that you've recently edited or opened",
  };

  const headings: ListViewColumns[] = [
    "name",
    "lastModified",
    "owner",
    "fileSize",
    "location",
    "elipsis",
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 ml-2 mb-4">
        <div className="drivePageHeading">Recent</div>
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={!isEmpty} />
          { !isEmpty && <Icon icon={faInfoCircle} hover={true} /> }
        </div>
      </div>
      <div className="ml-3 flex-1 flex flex-col min-h-0">
        <GroupedContentView data={data} cols={headings} emptyStateProps={emptyStateProps} />
      </div>
    </div>
  );
}