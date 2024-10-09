"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  useEffect(() => {
    const updateSidebarState = () => {
      setSidebarOpen(window.innerWidth > 1400);
    };

    updateSidebarState();

    const handleResize = () => {
      updateSidebarState();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
    const mediaQuery = window.matchMedia("(max-width: 1400px)");
    const handleScreenSizeChange = (e) => {
      if (e.matches) {
        setSidebarOpen(false);
      }
    };
    if (mediaQuery.matches) {
      setSidebarOpen(false);
    }
    mediaQuery.addEventListener("change", handleScreenSizeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenSizeChange);
    };
  }, []);

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
