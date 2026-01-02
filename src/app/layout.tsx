import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SourceProvider } from "@/components/SourceContext";
import { FontSizeControl } from "@/components/FontSizeControl";
import AskFAB from "@/components/ask/AskFAB";

const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: '--font-sans' });
const lora = Lora({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Church History Explorer",
  description: "Discover what the early church taught about your faith.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} ${lora.variable} font-sans bg-[#faf8f5] text-[#3d3529] antialiased`}>
        <SourceProvider>
          {children}
          <FontSizeControl />
          <AskFAB />
        </SourceProvider>
      </body>
    </html>
  );
}
