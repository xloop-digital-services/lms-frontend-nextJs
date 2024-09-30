import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";

export const metadata = {
  title: "Calender - LMS",
  description: "Learning Management System",
};


export default function CalendarLayout({ children }) {
  return (
    <>
      <SidebarProvider>
        <div>
          <Navbar />
        </div>
        <SideBar />
        {children}
      </SidebarProvider>
    </>
  );
}
