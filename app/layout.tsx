import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlockerPilot",
  description: "Manage scrum blockers with LLM classification and Jira sync"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
