"use client";

import Modal from "@/components/modal";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useMemo, useState, useTransition } from "react";

export const ModalContext = createContext<ModalContextType | null>(null);

export type ModalContextType = {
  isOpen: boolean;
  isTransition: boolean;
  show: (child: React.ReactNode) => void;
  close: (refresh: boolean) => void;
};

export default function ModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isTransition, startTransition] = useTransition();
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const close = useCallback((refresh: boolean) => {
    setContent(null);
    if (refresh) startTransition(() => router.refresh())
  }, [router]);
  const show = useCallback((modal: React.ReactNode) => setContent(modal), []);
  const value = useMemo(() => ({
    isOpen: content != null,
    show,
    close,
    isTransition,
  }), [content, show, close, isTransition]);

  return (
    <ModalContext.Provider value={value}>
      { children }
      {
        content && (
          <Modal
            className="fixed inset-0 z-1000000"
            portal="id_dialog"
          >{ content }</Modal>
        )
      }
    </ModalContext.Provider>
  );
}
