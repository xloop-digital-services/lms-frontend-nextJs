import { AuthProvider } from "@/providers/AuthContext";
import React from "react";
export const metadata = {
  title: "Account Verify - LMS",
  description: "Learning Management System",
};

export default function LoginLayout({ children }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
