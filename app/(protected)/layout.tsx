import AuthRedirectProvider from "@/contexts/authRedirect";
import React from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <AuthRedirectProvider>
      { children }
    </AuthRedirectProvider>
  );
}