"use client";

import { useContext } from "react";
import { ContentViewContext } from "@/contexts/contentView";

export default function useContentView() {
  const ctx = useContext(ContentViewContext);
  if (!ctx) {
    throw new Error("useContentView must be used within a ContentViewProvider");
  }
  return ctx;
}
