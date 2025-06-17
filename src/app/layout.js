import React from 'react';
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

export const metadata = {
  title: "Comprehensible Input",
  description: "Resources for language learners that use the method of Comprehensible Input.",
};

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export default function Layout({ children }) {
  return (
      <html lang="de">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>GlobeGuessr</title>
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </head>
        <body className={`${beVietnamPro.variable} antialiased`} >
          <Theme>
            <Analytics />

            {children}
          </Theme>
        </body>
      </html>
  );
}
