import React, { ReactNode } from "react";
import "./styles/style.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
