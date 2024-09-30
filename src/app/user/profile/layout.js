import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";

export const metadata = {
  title: "Profile - LMS",
  description: "Learning Management System",
};

export default function CoursesLayout({ children }) {
  return (
    <>
      <SidebarProvider>
        <Navbar />
        <SideBar />
        {children}
      </SidebarProvider>
    </>
  );
}
