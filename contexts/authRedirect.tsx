"use client";

import { createContext, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
};

export const AuthRedirectContext = createContext<AuthContextType | null>(null);

export default function AuthRedirectProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const path = usePathname();
  const searchParams = new URLSearchParams({
    callbackUrl: encodeURIComponent(path)
  });
  const loginUrl = `/auth/login?${searchParams}`;

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(loginUrl);
    },
  });

  useEffect(() => {
    const expiry = session?.expires;
    if (!expiry) return;

    const diffMs = (new Date(expiry)).valueOf() - Date.now();
    const timeout = Math.max(diffMs, 0);
    timeoutRef.current = setTimeout(() => {
      router.push(loginUrl)
    }, timeout);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [session, path, router, loginUrl]);

  return (
    <AuthRedirectContext.Provider value={{ session, status }}>
      {children}
    </AuthRedirectContext.Provider>
  );
}
