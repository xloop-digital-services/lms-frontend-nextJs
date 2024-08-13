import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
import { GroupProvider } from "@/providers/useGroup";
export default function AuthLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
