import React, { ReactNode } from "react";
import Head from "next/head";
import "./styles/style.css";

interface RootLayoutProps {
  children: ReactNode;
}

const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;