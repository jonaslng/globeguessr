import React from 'react';
import "./globals.css";
import { AuthProvider } from './context/AuthContext';
import { Analytics } from "@vercel/analytics/react"

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <html lang="de">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>GlobeGuessr</title>
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </head>
        <body>
          <Analytics />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
