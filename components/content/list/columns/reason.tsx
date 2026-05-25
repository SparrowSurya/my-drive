import { ListColumnContentBuilderProps, ListColumnHeadingBuilderProps } from "../types";


export function ListColumnReasonHeading({ headings }: Readonly<ListColumnHeadingBuilderProps>) {
  const heading = headings["reason"] ?? "Reason";

  return (
    <div className="flex items-center">
      { heading }
    </div>
  );
}


export function ListColumnReasonContent({ data }: Readonly<ListColumnContentBuilderProps>) {
  const reason = data.reason ?? "—";

  return (
    <div className="flex flex-row items-center">
      { reason }
    </div>  );
}