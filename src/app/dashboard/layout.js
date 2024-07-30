import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/providers/useSidebar";
import SideBar from "@/components/SideBar";
import AssignmentCard from "@/components/AssignmentCard";
export default function DashboardLayout({ children }) {

  const avatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/31.jpg",
    "https://randomuser.me/api/portraits/men/33.jpg",
    "https://randomuser.me/api/portraits/women/32.jpg"
];
  return (
    <>
      <SidebarProvider>
        <div>
          <Navbar />
        </div>
        <SideBar />
        {/* <AssignmentCard
          category="Backend"
          title="Beginner's Guide to Becoming a Professional Backend Developer"
          content="Increase engagement, and ultimately drive higher customer interest and satisfaction."
          priority="HIGH"
          avatars={avatars}
          extraCount={50}
        /> */}
        {children}
      </SidebarProvider>
    </>
  );
}
