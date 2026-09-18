import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Wolf — Graphic Designer & Digital Creator",
  description: "Bold brand identities, campaigns, and interactive digital experiences by John Wolf.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
