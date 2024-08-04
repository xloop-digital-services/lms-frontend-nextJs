import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
export default function UserLayout({ children }) {
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
