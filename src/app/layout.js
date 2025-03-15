import React from 'react';
import "./globals.css";

export default function Layout({ children }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GlobeGuessr</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
