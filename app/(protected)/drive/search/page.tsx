import { redirect } from "next/navigation";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import Icon from "@/components/icon";
import { queryFiles, queryFolders } from "./query";
import ContentView from "@/components/content/view";
import { ListViewColumn } from "@/components/content/list/types";
import { FilterType } from "@/hooks/useFilter";


export default async function SearchPage({
  searchParams
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
}>) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  if (!query || query === '') redirect('/drive/home');

  const [files, folders] = await Promise.all([ queryFiles(query), queryFolders(query) ]);
  const data = [ ...folders, ...files ];

  const headings: ListViewColumn[] = ["name", "owner", "updatedAt", "fileSize", "elipsis"];
  const filterTypes: FilterType[] = ["mimeType", "updatedAt"];

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4 ml-3">
        <div className="drivePageHeading">Search results</div>
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={data.length > 0} />
          <Icon icon={faInfoCircle} hover={true} />
        </div>
      </div>
      <ContentView data={data} headings={headings} filterTypes={filterTypes} />
    </div>
  );
}
