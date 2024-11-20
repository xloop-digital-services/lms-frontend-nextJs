"use client";
import { useEffect, useState } from "react";

const useWebSocket = (url, role) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (role === "instructor" || role === "student" ) {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        // console.log("WebSocket connection established");
        setLoading(false);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            announcement_id: data.announcement_id,
            title: data.title,
            message: data.message,
            assesment_type: data.assesment_type,
            assessment_id: parseInt(data.assessment_id, 10),
            status: data.status, // for notification read, unread status
            created_at: data.created_at,
            read: data.read, // for announcement
            course_id: parseInt(data.course_id, 10),
            notification_id: data.notification_id,
          },
        ]);
      };

      socket.onerror = (error) => {
        // console.error("WebSocket error:", error);
        setLoading(false);
      };

      socket.onclose = () => {
        // console.log("WebSocket connection closed. Reconnecting...");
        setLoading(true);
        setTimeout(() => {}, 3000);
      };

      return () => {
        socket.close();
        setLoading(false);
      };
    } else {
      setLoading(false);
    }
  }, [url, role]);

  return { messages, loading };
};

export default useWebSocket;
