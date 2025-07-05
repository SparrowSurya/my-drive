import React from "react";
import AuthRedirectProvider from "@/contexts/authRedirect";


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