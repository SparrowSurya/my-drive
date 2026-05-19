"use client";

import Modal from "@/components/modal";
import React, { createContext, useCallback, useMemo, useState } from "react";

export const ModalContext = createContext<ModalContextType | null>(null);

export type ModalContextType = {
  isOpen: boolean;
  show: (child: React.ReactNode) => void;
  close: () => void;
};

export default function ModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const close = useCallback(() => setContent(null), []);
  const show = useCallback((modal: React.ReactNode) => setContent(modal), []);
  const value = useMemo(() => ({
    isOpen: content != null,
    show,
    close,
  }), [content, show, close]);

  return (
    <ModalContext.Provider value={value}>
      { children }
      {
        content && (
          <Modal
            className="fixed inset-0 z-1000000 flex items-center justify-center bg-crust/50"
          >{ content }</Modal>
        )
      }
    </ModalContext.Provider>
  );
}
