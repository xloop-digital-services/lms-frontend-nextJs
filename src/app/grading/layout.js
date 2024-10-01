import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
import { AuthProvider } from "@/providers/AuthContext";

export const metadata = {
  title: "Grading - LMS",
  description: "Learning Management System",
};

export default function CoursesLayout({ children }) {
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
