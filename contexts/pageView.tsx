"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

export const PageViewContext = createContext<PageViewContextType | null>(null);

export const PageView = {
  home: "home",
  sharedWithMe: "shared-with-me",
  myDrive: "my-drive",
  recent: "recent",
  starred: "starred",
  trash: "trash",
  storage: "storage",
  folder: "folder",
  search: "search",
};

export type PageViewType = keyof typeof PageView;

export const pageViewToPrefixUrl = (page: PageViewType): string => `/drive/${PageView[page]}`;

export const urlToPageView = (url: string): PageViewType | null => {
  const entry = Object.entries(PageView).find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, value]) => url.startsWith(`/drive/${value}`)
  );

  return entry?.[0] as PageViewType | null;
};

export type PageViewContextType = PageViewType | null;

export default function PageViewProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const path = usePathname();
  const [page, setPage] = useState<PageViewType | null>(() => urlToPageView(path));

  useEffect(() => {
    const newPage = urlToPageView(path);
    if (newPage !== page) setPage(newPage);
  }, [path, page]);

  return (
    <PageViewContext.Provider value={page}>
      { children }
    </PageViewContext.Provider>
  );
}