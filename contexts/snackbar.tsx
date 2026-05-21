"use client";

import Snackbar from "@/components/snackbar";
import React, { createContext, useCallback, useMemo, useState, useRef } from "react";


export type SnackbarOptions = {
  message: string;
  undoAction?: () => void;
  onClose?: () => void;
  duration?: number;
  icon?: React.ReactNode;
};

export type SnackbarContextType = {
  show: (options: SnackbarOptions) => void;
  close: () => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export default function SnackbarProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [options, setOptions] = useState<SnackbarOptions | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (options?.onClose) {
      options.onClose();
    }
    setOptions(null);
  }, [options]);

  const show = useCallback((options: SnackbarOptions) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setOptions(options);

    if (options.duration === null || options.duration === undefined) {
      timerRef.current = setTimeout(() => {
        setOptions(null);
        if (options.onClose) {
          options.onClose();
        }
      }, options.duration);
    }
  }, []);

  const value = useMemo(() => ({ show, close }), [show, close]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {options && <Snackbar options={options} close={close} />}
    </SnackbarContext.Provider>
  );
}
