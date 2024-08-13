import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LMS",
  description: "Learning Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
