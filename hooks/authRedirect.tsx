"use client";

import { useContext } from "react";
import { AuthRedirectContext } from "@/contexts/authRedirect";

export default function useAuthRedirect() {
  const ctx = useContext(AuthRedirectContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
