"use client";

import { PageViewContext } from "@/contexts/pageView";
import { useContext } from "react";


export default function usePageView() {
  const context = useContext(PageViewContext);
  if (!context) {
    console.warn("usePageView must be used inside PageViewProvider");
    return null;
  }

  return context;
}