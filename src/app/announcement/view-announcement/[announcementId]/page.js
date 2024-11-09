"use client";
import {
  broadcastAnnouncement,
  getAnnouncementById,
  listAllBatches,
  listSessionsByBatch,
} from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaBullhorn, FaSpeakap, FaSpeakerDeck } from "react-icons/fa";
import { formatDateTime } from "@/components/AdminDataStructure";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [loader, setLoader] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const announcementId = params.announcementId;

  // console.log(announcementId);

  async function fetchAnnouncement() {
    const response = await getAnnouncementById(announcementId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setAnnouncement(response?.data);
        setLoader(false);
      } else {
        console.error("Failed to fetch announcement", response.status);
      }
    } catch (error) {
      throw error;
      // console.log("error", error);
    }
  }

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <div className="flex flex-col gap-4 w-full">
          <h2 className="flex gap-2 font-bold text-blue-500 text-xl font-exo mb-3 items-center flex-wrap">
            <p>
              <FaBullhorn />
            </p>{" "}
            New Announcement
          </h2>
          {loader ? (
            <div className="flex h-[400px] bg-surface-100 items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col">
              <p className="font-semibold text-blue-300 my-2">
                {" "}
                {announcement.title}
              </p>
              <p className="my-2"> {announcement.message}</p>

              <p className="text-dark-400 text-sm my-4">
                {formatDateTime(announcement.created_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}