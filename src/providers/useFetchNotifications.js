"use client";
import { useEffect, useState } from "react";
import { getNotificationByUserId } from "@/api/route";
import { useAuth } from "./AuthContext";

export const useFetchNotifications = (userID) => {
  const { userData } = useAuth();
  const group = userData?.Group;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (group === "admin") return;
    setLoading(true);
    try {
      const response = await getNotificationByUserId(userID);
      if (response.status === 200) {
        // console.log(response.data, "noti");
        setMessages(response.data.data);
      } else {
        // console.error(
        //   "Failed to fetch notifications, status:",
        //   response.status
        // );
      }
    } catch (error) {
      // console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!userID || (role !== "student" && role !== "instructor")) return;

    const interval = setInterval(() => {
      if (userID) {
        fetchNotifications();
      }
    }, 10000);
    fetchNotifications();
    return () => clearInterval(interval);
  }, [userID]);

  return { messages, loading, refetch: fetchNotifications };
};
