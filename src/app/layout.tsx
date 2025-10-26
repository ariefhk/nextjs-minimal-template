import type { Metadata } from "next";
import "@/styles/css/globals.css";
import { appMetadata } from "@/config/metadata";
import { geistMono, geistSans } from "@/styles/fonts/geist-font";

export const metadata: Metadata = {
  ...appMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
