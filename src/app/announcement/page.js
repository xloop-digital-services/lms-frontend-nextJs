"use client";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBullhorn, FaPlus } from "react-icons/fa";
import { formatDateTime } from "@/components/AdminDataStructure";
import { useAuth } from "@/providers/AuthContext";
import { getAllAnnouncements } from "@/api/route";

export default function Page({}) {
  const { isSidebarOpen } = useSidebar();
  const [loader, setLoader] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const router = useRouter();
  const userData = useAuth();
  const group = userData?.userData?.Group;
  //   console.log(group);
  //   console.log(userData);
  //   const isAdmin = userData?.userData?.Group === "admin";
  //   console.log(isAdmin);

  const goBack = () => {
    router.back();
  };

  const handleCreateAnnoucement = () => {
    router.push("/announcement/new-announcement");
  };

  async function fetchAnnouncement() {
    const response = await getAllAnnouncements();
    setLoader(true);
    try {
      if (response.status === 200) {
        setAnnouncement(response?.data);
        setLoader(false);
      } else {
        // console.error("Failed to fetch announcement", response.status);
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
          <div className="flex justify-between">
            <div className="flex mb-3 ">
              <div
                className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
                {/* <p>Back</p> */}
              </div>
              <h2 className="flex gap-2 font-bold text-blue-500 text-xl font-exo items-center flex-wrap">
                <p>
                  <FaBullhorn />
                </p>{" "}
                Posted announcements
              </h2>
            </div>
            <div>
              <button
                className="flex gap-2 w-full justify-center rounded-lg text-surface-100 border bg-blue-300  border-blue-300 hover:bg-[#3272b6] px-2 py-3 items-center"
                onClick={handleCreateAnnoucement}
              >
                <FaPlus />
                <p className="max-sm:hidden " title="New Announcement">
                  New announcement
                </p>
              </button>
            </div>
          </div>
          {loader ? (
            <div className="flex h-[700px] bg-surface-100 items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            announcement
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((ann) => (
                <div
                  key={ann.id}
                  className="flex flex-col border border-dark-300 rounded-xl p-4 my-2"
                >
                  <div className="flex gap-2 justify-between max-md:flex-col">
                    <p className="font-semibold text-blue-300 mb-2">
                      {ann.title}
                    </p>
                    {ann?.sessions?.map((session, index) => (
                      <p
                        key={index}
                        className=" text-sm bg-blue-600 border border-blue-300 px-2 py-1 rounded-md text-blue-300 mt-2 max-md:mt-1 max-md:mb-2"
                      >
                        {session.name}
                      </p>
                    ))}
                  </div>
                  <div className="my-2">
                    <p>{ann.message}</p>
                    {/* <p className="italic mt-4 font-light">
                      Please ignore any contradictory scheduling in the
                      calendar.
                    </p> */}
                  </div>
                  <p className="text-dark-400 text-sm">
                    {formatDateTime(ann.created_at)}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
