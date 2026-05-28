import { Metadata } from "next";
import { getStarredData } from "./query";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import Icon from "@/components/icon";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import StarredCustomView from "./view";
import { ListViewColumn } from "@/components/content/list/types";


export const metadata: Metadata = {
  title: "Starred - Drive",
};

export default async function StarredPage() {
  const data = await getStarredData();
  const isEmpty = data.length == 0;

  const headings: ListViewColumn[] = [
    "name",
    "owner",
    "updatedAt",
    "fileSize",
    "location",
    "elipsis",
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4 ml-3">
        <div className="drivePageHeading">Starred</div>
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={!isEmpty} />
          { !isEmpty && <Icon icon={faInfoCircle} hover={true} /> }
        </div>
      </div>
      <div className="ml-3 flex-1 flex flex-col min-h-0">
        <StarredCustomView data={data} cols={headings} />
      </div>
    </div>
  );
}
