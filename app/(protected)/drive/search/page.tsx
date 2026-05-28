import { redirect } from "next/navigation";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ContentViewToggleButton from "@/components/contentViewToggleButton";
import Icon from "@/components/icon";


export default async function SearchPage({
  searchParams
}: Readonly<{
  searchParams: Promise<{ q?: string }>,
}>) {
  const { q } = await searchParams;
  if (!q || q === '') redirect('/drive/home');

  const data = [];

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      <div className="flex flex-row justify-between shrink-0 mb-4 ml-3">
        <div className="drivePageHeading">Search results</div>
        <div className="flex flex-row gap-2 items-center">
          <ContentViewToggleButton visible={data.length > 0} />
          <Icon icon={faInfoCircle} hover={true} />
        </div>
      </div>
    </div>
  );
}
