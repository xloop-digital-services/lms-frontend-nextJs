"use client";
import { useEffect, useState } from "react";

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([{
    title: "",
    message: "",
    assessment_type: "",
    status: "",
  }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = function () {
      console.log("WebSocket connection established");
      setLoading(false);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          title: data.title,
          message: data.message,
          assessment_type: data.assesment_type,
          status: data.status,
        },
      ]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setLoading(false);
    };

    socket.onerror = function (error) {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    return () => {
      socket.close();
      setLoading(false);
    };
  }, [url]);

  return { messages, loading };
};

export default useWebSocket;
