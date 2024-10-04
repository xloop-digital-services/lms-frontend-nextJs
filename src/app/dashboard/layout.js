"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/providers/AuthContext";

export default function DashboardLayout({ children }) {
  const { userData } = useAuth();
  return (
    <>
      <SidebarProvider>
        {userData?.Group === "admin" ? (
          <SideBar />
        ) : ["instructor", "student"].includes(userData?.Group) &&
          userData?.session  ? (
          <SideBar />
        ) : null}

        {/* <div> */}
        <Navbar />
        {/* </div> */}

        {children}
      </SidebarProvider>
    </>
  );
}