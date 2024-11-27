"use client";
import { useEffect, useState } from "react";
import { getAnnouncementByUserId } from "@/api/route";

export const useFetchAnnouncement = (userID) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await getAnnouncementByUserId(userID);
      if (response.status === 200) {
        setAnnouncements(response.data.data);
        console.log(response.data, "ann");
      } else {
        console.error(
          "Failed to fetch announcements, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userID) return;

    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 7000);
    fetchAnnouncements();
    return () => clearInterval(interval);
  }, [userID]);

  return { announcements, loading, refetch: fetchAnnouncements };
};
