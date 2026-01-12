import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "@/components/ui";
import { AuthProvider } from "@/providers";

const poppins = localFont({
  src: [
    {
      path: "./fonts/Poppins-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Link6ync",
  description: "A comprehensive authentication system with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
