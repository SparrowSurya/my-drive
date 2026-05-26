"use client";

import { PageViewContext } from "@/contexts/pageView";
import { useContext } from "react";


export default function usePageView() {
  const context = useContext(PageViewContext);
  if (!context) {
    throw new Error("usePageView must be used inside PageViewProvider");
  }

  return context;
}