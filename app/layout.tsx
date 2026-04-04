import type { Metadata } from "next";
import Script from "next/script";

import { AppShell } from "@/components/layout/app-shell";
import { LenisProvider } from "@/components/ui/lenis-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEJTERI Clan",
  description: "Hejteri",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`
            (() => {
              const shouldRemoveAttribute = (name) =>
                name === "bis_skin_checked" ||
                name === "bis_register" ||
                name.startsWith("__processed_") ||
                name.startsWith("bis_");

              const stripAttributes = () => {
                const nodes = [document.documentElement, ...document.querySelectorAll("*")];

                for (const node of nodes) {
                  for (const attribute of [...node.attributes]) {
                    if (shouldRemoveAttribute(attribute.name)) {
                      node.removeAttribute(attribute.name);
                    }
                  }
                }
              };

              stripAttributes();
              new MutationObserver(stripAttributes).observe(document.documentElement, {
                subtree: true,
                attributes: true,
              });
            })();
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="font-sans">
        <LenisProvider>
          <AppShell>{children}</AppShell>
        </LenisProvider>
      </body>
    </html>
  );
}
