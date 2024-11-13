"use client";
import React, { useEffect, useState } from "react";
import { FaBell, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useWebSocket from "@/providers/useWebSockets";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import { formatDateTime } from "./AdminDataStructure";
import { readAnnouncement, readNotification } from "@/api/route";

export default function Notifications() {
  const { userData } = useAuth();
  const userID = userData?.User?.id;
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const group = userData?.Group;
  const [currentNotiId, setCurrentNotiId] = useState(null);
  // console.log(userID);
  const router = useRouter();
  const { messages: messages, loading: loading } = useWebSocket(
    `ws://13.126.167.22:8000/ws/notification/?user_id=${userID}`,
    group
  );

  const { messages: announcements, loading: loader } = useWebSocket(
    `ws://13.126.167.22:8000/ws/announcements/?user_id=${userID}`,
    group
  );

  const handleCreateAnnoucement = () => {
    router.push("/announcement/new-announcement");
  };

  const handleAnnounce = async (id) => {
    router.push(`/announcement/view-announcement/${id}`);
    setCurrentNotiId(id);
    try {
      const data = {
        user_id: userID,
        announcement_id: id,
      };
      const response = await readAnnouncement(data);
      console.log(response);
    } catch (error) {
      // console.error("Failed to read announcement:", error);
    }
  };

  const handleNoti = async (id, type, notiId) => {
    router.push(`/${type}/course/${id}`);
    setCurrentNotiId(notiId);
    try {
      const response = await readNotification(userID, notiId);
      // console.log(response);
    } catch (error) {
      // Handle and log any errors
      // console.error("Failed to read announcement:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col p-1 h-96 overflow-y-scroll scrollbar-webkit font-inter">
        <h3 className="font-bold px-2 font-exo my-1 text-blue-500">
          Announcements
        </h3>
        {loader && (
          <div className="h-40 w-full flex items-center justify-center ">
            <CircularProgress size={20} />
          </div>
        )}

        <div className="h-40 w-full overflow-y-scroll scrollbar-webkit">
          {announcements && announcements.length > 0 ? (
            announcements
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((announcement, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer px-2 max-sm:px-0 justify-center items-center flex-col"
                  onClick={() => {
                    handleAnnounce(announcement.announcement_id);
                  }}
                >
                  <div className={`flex flex-col`}>
                    <div
                      className={`flex mx-2 justify-center items-center py-1 line-clamp-2 ${
                        announcement.read === false
                          ? "bg-blue-600 rounded-xl"
                          : "bg-surface-100"
                      }`}
                    >
                      <div className="flex justify-center items-center w-8 p-1 rounded-full border border-blue-300 bg-blue-600 mx-4">
                        <FaBell size={20} fill="#03A1D8" />
                      </div>
                      <div className="flex flex-col w-64">
                        <p className="font-md">
                          {announcement.message}.<br />
                          <p className="italic text-sm text-dark-400">
                            Please ignore any contradictory scheduling in the
                            calendar.
                          </p>
                        </p>
                        <p className="text-dark-400 font-sm mt-1">
                          {formatDateTime(announcement.created_at)}
                        </p>
                      </div>
                    </div>
                    <hr className="text-dark-200 my-2"></hr>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-blue-300 flex items-center justify-center">
              No recent announcements found
            </p>
          )}
        </div>

        <h3 className="font-bold px-2 font-exo my-1 text-blue-500">
          Notifications
        </h3>
        {loading && (
          <div className="h-40 w-full flex items-center justify-center ">
            <CircularProgress size={20} />
          </div>
        )}

        <div className="h-40 overflow-y-scroll scrollbar-webkit">
          {messages && messages.length > 0 ? (
            messages
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((message, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer px-2 max-sm:px-0 justify-center items-center flex-col"
                  onClick={() =>
                    handleNoti(
                      message.course_id,
                      message.assesment_type,
                      message.notification_id
                    )
                  }
                >
                  <div className="flex flex-col">
                    <div
                      className={`flex mx-2 justify-center items-center py-1 line-clamp-2 ${
                        message.status === "unread"
                          ? "bg-blue-600 rounded-xl"
                          : "bg-surface-100"
                      }`}
                    >
                      <div className="flex justify-center items-center w-8 p-1 rounded-full border border-blue-300 bg-blue-600 mx-4">
                        <FaBell size={20} fill="#03A1D8" />
                      </div>

                      <div className="flex flex-col w-64">
                        <p className="font-md">{message.message}</p>
                        <p className="text-dark-400 font-sm mt-1">
                          {formatDateTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                    <hr className="text-dark-200 my-2"></hr>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-blue-300 flex items-center justify-center">
              No recent notifications found
            </p>
          )}
        </div>

        {/* {!isStudent && (
          <div className="w-full px-4">
            <button
              className="flex gap-2 w-full justify-center rounded-xl py-2 items-center hover:bg-blue-100 hover:text-blue-300"
              onClick={handleCreateAnnoucement}
            >
              <FaPlus />
              <p>New announcement</p>
            </button>
          </div>
        )} */}
      </div>
    </>
  );
}
