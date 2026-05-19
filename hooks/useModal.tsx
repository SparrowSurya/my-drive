"use client";

import { useContext } from "react";
import { ModalContext } from "@/contexts/modal";


export default function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return context;
}