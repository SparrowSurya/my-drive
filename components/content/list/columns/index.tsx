import { ListColumnNameHeading, ListColumnNameContent } from "./name";
import { ListColumnReasonHeading, ListColumnReasonContent } from "./reason";
import { ListColumnOwnerHeading, ListColumnOwnerContent } from "./owner";
import { ListColumnLastModifiedHeading, ListColumnLastModifiedContent } from "./lastModified";
import { ListColumnDateTrashedHeading, ListColumnDateTrashedContent } from "./dateTrashed";
import { ListColumnLocationHeading, ListColumnLocationContent } from "./location";
import { ListColumnFileSizeHeading, ListColumnFileSizeContent } from "./fileSize";
import { ListColumnElipsisHeading, ListColumnElipsisContent } from "./elipsis";
import { ListColumnBuilder, ListViewColumn } from "../types";


const columnRenderer: Record<ListViewColumn, ListColumnBuilder> = {
  "name": {
    heading: (key, props) => <ListColumnNameHeading key={key} {...props} />,
    content: (key, props) => <ListColumnNameContent key={key} {...props} />,
  },
  "reason": {
    heading: (key, props) => <ListColumnReasonHeading key={key} {...props} />,
    content: (key, props) => <ListColumnReasonContent key={key} {...props} />,
  },
  "owner": {
    heading: (key, props) => <ListColumnOwnerHeading key={key} {...props} />,
    content: (key, props) => <ListColumnOwnerContent key={key} {...props} />,
  },
  "updatedAt": {
    heading: (key, props) => <ListColumnLastModifiedHeading key={key} {...props} />,
    content: (key, props) => <ListColumnLastModifiedContent key={key} {...props} />,
  },
  "deletedAt": {
    heading: (key, props) => <ListColumnDateTrashedHeading key={key} {...props} />,
    content: (key, props) => <ListColumnDateTrashedContent key={key} {...props} />,
  },
  "fileSize": {
    heading: (key, props) => <ListColumnFileSizeHeading key={key} {...props} />,
    content: (key, props) => <ListColumnFileSizeContent key={key} {...props} />,
  },
  "location": {
    heading: (key, props) => <ListColumnLocationHeading key={key} {...props} />,
    content: (key, props) => <ListColumnLocationContent key={key} {...props} />,
  },
  "elipsis": {
    heading: (key, props) => <ListColumnElipsisHeading key={key} {...props} />,
    content: (key, props) => <ListColumnElipsisContent key={key} {...props} />,
  },
};

export default columnRenderer;
