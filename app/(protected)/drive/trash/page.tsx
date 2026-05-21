import { Metadata } from "next";
import { EmptyStateProps } from "@/components/emptyState";
import { getTrashFiles } from "./query";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import ContentGroupedView from "@/components/content/groupedView";


export const metadata: Metadata = {
  title: "Trash - Drive",
};

export default async function TrashPage() {
  const data = await getTrashFiles();
  const isEmpty = Object.keys(data).length == 0;

  const emptyStateProps: EmptyStateProps = {
    image: '/assets/svg/empty_state_trash.svg',
    title: 'Trash is empty',
    para: 'Items moved to the trash will be deleted forever after 30 days',
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4">
        <div className="drivePageHeading">Trash</div>
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={!isEmpty} />
          { !isEmpty && <Icon icon={faInfoCircle} hover={true} /> }
        </div>
      </div>
      <div className="ml-3 flex-1 flex flex-col min-h-0">
        <ContentGroupedView data={data} emptyStateProps={emptyStateProps} />
      </div>
    </div>
  );
}