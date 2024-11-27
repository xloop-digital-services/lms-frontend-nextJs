import { getAnnouncementByUserId } from "@/api/route";

export const useFetchAnnouncement = ({userID}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchAnnouncements = async () => {
    setLoader(true);
    try {
      const response = await getAnnouncementByUserId(userID);
      if (response.status === 200) {
        setAnnouncements(response.data);
      } else {
        console.error(
          "Failed to fetch announcements, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loader,
    refetch: { fetchAnnouncements },
  };
  uu
};
