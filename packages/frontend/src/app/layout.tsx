import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/providers/StarknetProvider";

export const metadata: Metadata = {
  title: "AgentSend - Private Messaging on Starknet",
  description: "Privacy-first messenger powered by Tongo SDK and Starknet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StarknetProvider>
          {children}
        </StarknetProvider>
      </body>
    </html>
  );
}
