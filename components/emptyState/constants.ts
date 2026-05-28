import { PageViewType } from "@/contexts/pageView";


export type EmptyStateData = {
  image: string | React.ReactNode,
  title: string | React.ReactNode,
  para?: string | React.ReactNode,
};

const emptyStates: Record<PageViewType, EmptyStateData> = {
  home: {
    image: "/assets/svg/empty_state_home.svg",
    title: "Drag your files and folders here or use the 'New' button to upload",
  },
  sharedWithMe: {
    image: "/assets/svg/empty_state_shared_with_me.svg",
    title: "Nothing has been shared with you yet",
    para: "See all the items shared with you in one place",
  },
  myDrive: {
    image: '/assets/svg/empty_state_my_drive.svg',
    title: 'A place for all of your files',
    para: 'Drag your files and folders here or use the "New" button to upload',
  },
  recent: {
    image: "/assets/svg/empty_state_recent.svg",
    title: "No recent files",
    para: "See all the files that you've recently edited or opened",
  },
  starred: {
    image: "/assets/svg/empty_state_storage.svg",
    title: "No starred files",
    para: "Add stars to things that you want to easily find later",
  },
  trash: {
    image: '/assets/svg/empty_state_trash.svg',
    title: 'Trash is empty',
    para: 'Items moved to the trash will be deleted forever after 30 days',
  },
  storage: {
    image: "/assets/svg/empty_state_storage.svg",
    title: "No files are using storage",
    para: "Items you own will use Drive storage",
  },
  folder: {
    image: '/assets/svg/empty_state_empty_folder.svg',
    title: 'Drop files here',
    para: 'Or use the "New" button',
  },
  search: {
    image: "/assets/svg/empty_state_recent.svg",
    title: "No matching results",
    para: "Adjust your filters or try searching all of Drive",
  },
};

export { emptyStates };
