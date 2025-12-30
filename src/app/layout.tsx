import type { Metadata } from "next";
import { Inter, Crimson_Pro, Lora } from "next/font/google";
import "./globals.css";
import { SourceProvider } from "@/components/SourceContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const crimson = Crimson_Pro({ subsets: ["latin"], variable: '--font-serif' });
const lora = Lora({ subsets: ["latin"], variable: '--font-serif-alt' });

export const metadata: Metadata = {
  title: "Church History | Trace the Claims",
  description: "Trace doctrinal claims through 2,000 years of history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimson.variable} ${lora.variable} font-sans bg-stone-50 text-slate-900 antialiased`}>
        <SourceProvider>
          {children}
        </SourceProvider>
      </body>
    </html>
  );
}
