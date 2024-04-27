import type { Metadata } from "next";
import "@styles/globals.css";
import Provider from "@components/Provider";

export const metadata: Metadata = {
  title: "Artify",
  description: "Discover and Share Art",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
