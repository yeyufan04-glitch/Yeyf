import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maozheng-trust-0910.yeyufan04.chatgpt.site"),
  title: "贸证贯通｜可信贸易作业平台",
  description: "基于交易证据智能与可信AI的跨境贸易金融协同平台竞赛PoC",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "贸证贯通｜交易证据智能 × 可信AI执行",
    description: "TEG-ESE组织交易证据，CAV约束AI进入银行流程。",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
