"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Function to update the sidebar state based on window width
  const updateSidebarState = () => {
    setSidebarOpen(window.innerWidth > 1400);
  };

  useEffect(() => {
    // Retrieve sidebar state from localStorage on mount
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    } else {
      // Initialize sidebar based on screen size
      updateSidebarState();
    }

    // Handle window resize and media query changes
    const mediaQuery = window.matchMedia("(max-width: 1400px)");
    const handleResize = () => updateSidebarState();
    const handleScreenSizeChange = (e) => setSidebarOpen(!e.matches);

    // Add event listeners for resize and media query changes
    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleScreenSizeChange);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleScreenSizeChange);
    };
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const contextValue = {
    isSidebarOpen,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};
