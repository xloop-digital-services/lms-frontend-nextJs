import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
import { AuthProvider } from "@/providers/AuthContext";

export const metadata = {
  title: "Quiz - LMS",
  description: "Learning Management System",
};

export default function QuizLayout({ children }) {
  return (
    <>
      <AuthProvider>
        <SidebarProvider>
          <Navbar />
          <SideBar />
          {children}
        </SidebarProvider>
      </AuthProvider>
    </>
  );
}
