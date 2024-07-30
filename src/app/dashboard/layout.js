import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
import Sidebar from "@/components/Sidebar";
export default function DashboardLayout({ children }) {
  return (
    <>
      <SidebarProvider>
        {/* <div> */}
          <Navbar />
        {/* </div> */}
        <SideBar />
        {/* <Sidebar /> */}
        {children}
      </SidebarProvider>
    </>
  );
}
