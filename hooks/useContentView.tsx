import { useEffect, useState } from "react";
import LocalStorage from "@/lib/storage/local";
import LocalStorageKey from "@/lib/constants/localStorage";


export type ContentViewType = "list" | "grid";

export default function useContentView() {
  const [view, setView] = useState<ContentViewType>("list");
  const defaultView = "list";

  useEffect(() => {
    const savedView = LocalStorage.get<ContentViewType>(LocalStorageKey.view, defaultView);
    console.log("Saved View:", savedView);

    setView(savedView ?? defaultView);
  }, []);

  const updateView = (newView: ContentViewType) => {
    setView(newView);
    LocalStorage.set(LocalStorageKey.view, newView);
  };

  return { view, updateView };
}
