import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserSessions, readAnnouncement } from "../services/api";
export const useFetchNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchNotifications = async () => {
    setLoader(true);
    try {
      const response = await getUserSessions(); 
      if (response.status === 200) {
        setMessages(response.data);
      } else {
        console.error("Failed to fetch notifications, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  return { messages, loader, refetch: fetchNotifications };
};
