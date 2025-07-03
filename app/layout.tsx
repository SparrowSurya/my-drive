"use client";

import { Noto_Sans, Noto_Sans_Mono, Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: "400",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} ${poppins.variable} ${notoSans.className} bg-crust antialiased`}
      >
        <SessionProvider
          refetchInterval={parseInt(process.env.NEXT_PUBLIC_SESSION_REFETCH_INTERVAL!)}
          refetchOnWindowFocus={!!parseInt(process.env.NEXT_PUBLIC_SESSION_REFETCH_ON_WINDOW_FOCUS!)}
          refetchWhenOffline={false}
        >
          {children}
          <div id="id_modal"></div>
          <div id="id_notify"></div>
        </SessionProvider>
      </body>
    </html>
  );
}
