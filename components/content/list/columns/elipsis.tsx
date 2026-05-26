import usePageView from "@/hooks/usePageView";
import ContentOptionMenu from "../../options";
import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";


export function ListColumnElipsisHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["elipsis"] ?? "";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnElipsisContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const { page } = usePageView();

  return (
    <div className="flex flex-row items-center mx-2 shrink-0">
      <ContentOptionMenu data={data} isTrash={page === "trash"} />
    </div>
  );
}