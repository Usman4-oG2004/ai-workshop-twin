import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Workshop Twin | ISA — Learn Electrical & Plumbing Skills",
  description:
    "Make 20 mistakes in a virtual workshop before making one in a real workshop. Interactive AI-powered training for beginner electricians and plumbers.",
  keywords: ["AI", "skilled trades", "electrical training", "plumbing training", "vocational", "ISA"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-workshop-bg">
        {/* Scan-line overlay */}
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015] bg-scan-lines" />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A1A1E",
              color: "#FAFAFA",
              border: "1px solid #2A2A2F",
              borderRadius: "2px",
              fontFamily: "var(--font-outfit)",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
