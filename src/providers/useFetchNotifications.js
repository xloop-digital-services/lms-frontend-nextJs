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
    if (!userID || group === "admin") return;
    setLoading(true);
    try {
      const response = await getNotificationByUserId(userID);
      if (response.status === 200) {
        setMessages(response.data.data);
      } else {
      }
    } catch (error) {
      // console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userID || group === "admin") return;

    // Call immediately
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 120000);

    return () => clearInterval(interval);
  }, [userID, group]);


  return { messages, loading, refetch: fetchNotifications };
};
