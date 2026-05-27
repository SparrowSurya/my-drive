import { OptionSeperator } from "@/components/option";
import { ContentData } from "../../types"
import DeleteForeverOption from "./deleteForever";
import DownloadOption from "./download";
import MoveToTrashOption from "./moveToTrash";
import OrganiseOption from "./organise";
import RenameOption from "./rename";
import RestoreOption from "./restore";
import ShareOption from "./share";
import StarredOption from "./starred";
import { OptionSeperatorProps } from "@/components/option/seperator";


export enum ContentOption {
  download = "Download",
  rename = "Rename",
  organise = "Organise",
  share = "Share",
  moveToTrash = "MoveToTrash",
  restore = "Restore",
  deleteForever = "DeleteForever",
  starred = "Starred",
  seperator = "Seperator",
};

export type OptionBuilderProps = {
  data: ContentData;
};

export const OptionBuilder: Record<
  ContentOption,
  (props: OptionBuilderProps) => React.ReactNode
> = {
  [ContentOption.download]: (props) => <DownloadOption {...props} />,
  [ContentOption.rename]: (props) => <RenameOption {...props} />,
  [ContentOption.organise]: (props) => <OrganiseOption {...props} />,
  [ContentOption.share]: (props) => <ShareOption {...props} />,
  [ContentOption.moveToTrash]: (props) => <MoveToTrashOption {...props} />,
  [ContentOption.restore]: (props) => <RestoreOption {...props} />,
  [ContentOption.deleteForever]: (props) => <DeleteForeverOption {...props} />,
  [ContentOption.starred]: (props) => <StarredOption {...props} />,
  [ContentOption.seperator]: (props) => <OptionSeperator {...(props as OptionSeperatorProps)} />,
};
