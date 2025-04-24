import { Inter } from "next/font/google";
import "./globals.css";
import "./nprogress.css";
import { AuthProvider } from "@/providers/AuthContext";
import "react-datepicker/dist/react-datepicker.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LMS",
  description: "Learning Management System",
  icons:{
    icon :['/favicon.ico?v=1'],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
