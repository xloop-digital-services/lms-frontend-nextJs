"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { formatDateTime } from "./AdminDataStructure";
import { readAnnouncement, readNotification } from "@/api/route";
import { useFetchAnnouncement } from "@/providers/useFetchAnnouncement";
import { useFetchNotifications } from "@/providers/useFetchNotifications";
import { useAuth } from "@/providers/AuthContext";

export default function Notifications() {
  const { userData } = useAuth();
  const userID = userData?.User?.id;

  const [currentNotiId, setCurrentNotiId] = useState(null);

  const {
    announcements,

    loading: announcementsLoading,
    refetch: refetchAnnouncements,
  } = useFetchAnnouncement(userID);
  const {
    messages,
    loading: notificationsLoading,
    refetch: refetchNotifications,
  } = useFetchNotifications(userID);

  const router = useRouter();

  const handleCreateAnnouncement = () => {
    router.push("/announcement/new-announcement");
  };

  const handleAnnounce = async (id) => {
    router.push(`/announcement/view-announcement/${id}`);
    setCurrentNotiId(id);
    console.log(id);
    try {
      const data = {
        user_id: userID,
        announcement_id: id,
      };
      const response = await readAnnouncement(data);
      // console.log(response);
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

  const renderLoader = () => (
    <div className="h-40 w-full flex items-center justify-center">
      <CircularProgress size={20} />
    </div>
  );

  return (
    <div className="flex flex-col p-1 h-96 overflow-y-scroll scrollbar-webkit font-inter">
      <div className="fixed">
        <h3 className="font-bold p-2 fixed font-exo text-blue-500">
          Announcements
        </h3>
      </div>
      <div className="overflow-y-scroll mt-8 h-[50%] scrollbar-webkit">
        {announcementsLoading ? (
          renderLoader()
        ) : announcements?.length > 0 ? (
          announcements
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((announcement) => (
              <>
                <div
                  key={announcement.id}
                  className={`flex mx-2 justify-center my-2 items-center py-1 line-clamp-2 cursor-pointer ${
                    announcement.read_status
                      ? "bg-surface-100"
                      : "bg-blue-600 rounded-xl"
                  }`}
                  onClick={() => handleAnnounce(announcement.id)}
                >
                  <div className="flex justify-center items-center w-8 p-1 rounded-full border border-blue-300 bg-blue-600 mx-4">
                    <FaBell size={20} fill="#03A1D8" />
                  </div>
                  <div className="flex flex-col w-64">
                    <p className="font-md">
                      {announcement.message}
                      <br />
                      <p className="italic text-sm text-dark-400">
                        Please ignore any contradictory scheduling in the
                        calendar.
                      </p>
                    </p>
                    <p className="text-dark-400 text-sm mt-1">
                      {formatDateTime(announcement.created_at)}
                    </p>
                  </div>
                </div>
                <hr className="text-dark-200 m-2"></hr>
              </>
            ))
        ) : (
          <p className="text-blue-300 flex items-center justify-center">
            No announcements found.
          </p>
        )}
      </div>
      <div className="fixed mt-48">
        <h3 className="font-bold p-2 fixed font-exo  text-blue-500 ">
          Notifications
        </h3>
      </div>
      <div className="overflow-y-scroll mt-12 h-[50%] scrollbar-webkit">
        {notificationsLoading ? (
          renderLoader()
        ) : messages?.length > 0 ? (
          messages
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((msg) => (
              <>
                <div
                  key={msg.notification_id}
                  className={`flex mx-2 my-2 justify-center items-center py-1 line-clamp-2 cursor-pointer ${
                    msg.status === "unread"
                      ? "bg-blue-600 rounded-xl"
                      : "bg-surface-100"
                  }`}
                  onClick={() =>
                    handleNoti(
                      msg.course_id,
                      msg.assesment_type,
                      msg.notification_id
                    )
                  }
                >
                  <div className="flex justify-center items-center w-8 p-1 rounded-full border border-blue-300 bg-blue-600 mx-4">
                    <FaBell size={20} fill="#03A1D8" />
                  </div>
                  <div className="flex flex-col w-64">
                    <p className="font-md">{msg.message}</p>
                    <p className="text-dark-400 text-sm mt-1">
                      {formatDateTime(msg.created_at)}
                    </p>
                  </div>
                  <hr className="text-dark-200 my-2"></hr>
                </div>
                <hr className="text-dark-200 m-2"></hr>
              </>
            ))
        ) : (
          <p className="text-blue-300 flex items-center justify-center">
            No notifications found.
          </p>
        )}
      </div>
    </div>
  );
}
