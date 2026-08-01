import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DonateButton } from "@/components/DonateButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buy Me A Coffee | Support Creators with Tipping",
  description: "A beautiful UI clone of Buy Me A Coffee built in Next.js. Give your audience a way to thank you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable}`}>
        <AppProvider>
          <InteractiveBackground />
          <ThemeToggle />
          <DonateButton />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
