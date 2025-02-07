"use client"; // 👈 Keep this at the top

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <html lang="en">
      <body className={client ? `${geistSans.variable} ${geistMono.variable} antialiased` : "antialiased"}>
        {children}
      </body>
    </html>
  );
}
