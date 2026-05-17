"use client";

import React, { createContext, useState, useEffect } from "react";
import LocalStorage from "@/lib/storage/local";
import LocalStorageKey from "@/lib/constants/localStorage";

export type ContentViewType = "list" | "grid";

export type ContentViewContextType = {
  view: ContentViewType;
  updateView: (newView: ContentViewType) => void;
};

export const ContentViewContext = createContext<ContentViewContextType | undefined>(undefined);

export default function ContentViewProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [view, setView] = useState<ContentViewType>("list");
  const defaultView = "list";

  useEffect(() => {
    const savedView = LocalStorage.get<ContentViewType>(LocalStorageKey.view, defaultView);
    setView(savedView ?? defaultView);
  }, []);

  const updateView = (newView: ContentViewType) => {
    setView(newView);
    LocalStorage.set(LocalStorageKey.view, newView);
  };

  return (
    <ContentViewContext.Provider value={{ view, updateView }}>
      {children}
    </ContentViewContext.Provider>
  );
}
