"use client";
import {
  broadcastAnnouncement,
  listAllBatches,
  listSessionsByBatch,
} from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [openBatch, setOpenBatch] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isBatchSelected, setIsBatchSelected] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedSessionID, setSelectedSessionID] = useState([]);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isSessionSelected, setIsSessionSelected] = useState(false);
  const [loadingBroadCast, setLoadingBroadCast] = useState(false);
  const mouseClick = useRef(null);
  const router = useRouter();

  useClickOutside(mouseClick, () => {
    setIsBatchOpen(false);
    setIsSessionOpen(false);
  });

  const handleSubmitAnnoucement = async () => {
    try {
      setLoadingBroadCast(true);
      if (selectedSessionID.length === 0 || !title || !message) {
        toast.error("Fill out the fields properly!");
        return;
      }
      const data = {
        session_ids: selectedSessionID,
        title: title,
        message: message,
      };
      const response = await broadcastAnnouncement(data);
      console.log("submit", response);
      toast.success(response.data.message);
      setTitle("");
      setMessage("");
      setSelectedBatch(null);
      setSelectedSessionID([]);
      setSelectedSessions([]);
      router.push("/dashboard");
    } catch (error) {
      console.log(error, "error while fetching the data");
    } finally {
      setLoadingBroadCast(false);
    }
  };

  useEffect(() => {
    const getBatch = async () => {
      try {
        const response = await listAllBatches();

        const batchOptionsArray = response?.data.map((batch) => batch.batch);
        setBatches(batchOptionsArray);
      } catch (error) {
        console.log("error while fetching the batches", error);
        if (error.message === "Network Error") {
          toast.error(error.message, "Check your internet connection");
        }
      } finally {
        setLoadingBatch(false);
      }
    };
    getBatch();
  }, []);

  useEffect(() => {
    const handleSessionsByBatch = async () => {
      try {
        setLoadingSession(true);
        const response = await listSessionsByBatch(selectedBatch);
        // console.log("sessions by batch", response.data);
        setSessions(response.data);
      } catch (error) {
        console.log(error, "error while sessions by batch");
      } finally {
        setLoadingSession(false);
      }
    };
    if (selectedBatch) {
      handleSessionsByBatch();
    }
  }, [selectedBatch]);

  const toggleBatchOpen = () => {
    setIsBatchOpen(true);
  };

  const handleBatchSelect = (option) => {
    setSelectedBatch(option);
    setIsBatchSelected(true);
    setIsBatchOpen(false);
    setSelectedSessions([]);
    setSelectedSessionID([]);
    setIsSessionSelected(false);
  };

  const toggleSessionOpen = () => {
    setIsSessionOpen(true);
  };

  const handleSessionSelect = (option) => {
    const isAlreadySelected = selectedSessions.some(
      (session) => session.id === option.id
    );

    if (isAlreadySelected) {
      setSelectedSessions(
        selectedSessions.filter((session) => session.id !== option.id)
      );
      setSelectedSessionID(selectedSessionID.filter((id) => id !== option.id));
    } else {
      setSelectedSessions([...selectedSessions, option]);
      setSelectedSessionID([...selectedSessionID, option.id]);
    }
    setIsSessionSelected(selectedSessions.length > 0);
  };

  const removeSession = (id) => {
    setSelectedSessions(
      selectedSessions.filter((session) => session.id !== id)
    );
    setSelectedSessionID(
      selectedSessionID.filter((sessionId) => sessionId !== id)
    );
    setIsSessionSelected(selectedSessions.length > 1);
  };

  const handleCancel = () => {
    setTitle("");
    setMessage("");
    setSelectedBatch(null);
    setSelectedSessionID([]);
    setSelectedSessions([]);
    router.push("/dashboard");
  };

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
          <p className="font-bold text-blue-500 text-xl font-exo mb-3">
            Create an Announcement
          </p>
          <div className="w-full space-y-2">
            <p className="font-medium text-sm">Title</p>
            <input
              type="text"
              className="px-4 py-3 border border-dark-300 rounded-xl w-full outline-none"
              value={title}
              placeholder="Enter the title for announcement"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2">
            <p className="font-medium text-sm">Message</p>
            <textarea
              className="px-4 py-3 border border-dark-300 rounded-xl w-full min-h-[100px] max-h-[150px] overflow-auto resize-y scrollbar-webkit outline-none"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <p className="font-medium text-sm">Select the batch</p>

            <div className="border border-dark-300 rounded-xl w-full flex items-center justify-between pl-4 pr-2 py-2">
              <p className={`${selectedBatch ? "": "text-dark-400"}`}>{selectedBatch || "Select a batch"}</p>
              <div className="relative text-[15px] ">
                <button
                  onClick={toggleBatchOpen}
                  className={`${
                    !isBatchSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center sm:w-[250px] text-[#92A7BE] w-full  hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  Select batch
                  <span
                    className={`${
                      isBatchOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isBatchOpen && (
                  <div
                    ref={mouseClick}
                    className="absolute z-10 w-full max-h-[200px] mt-1 bg-surface-100  overflow-auto scrollbar-webkit border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingBatch ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : batches && batches.length > 0 ? (
                      batches.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleBatchSelect(option)}
                          className="p-2 cursor-pointer "
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-dark-300">
                        no batch found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-sm">Select the session</p>

            <div className="border border-dark-300 rounded-xl w-full flex items-center justify-between pl-4 pr-2 py-2">
              <div className="flex gap-2 items-center flex-wrap">
                {selectedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center bg-blue-100 px-2 py-1 rounded-lg text-blue-800 mr-2"
                  >
                    <p className="mr-2">{session.session_name}</p>
                    <IoClose
                      size={15}
                      onClick={() => removeSession(session.id)}
                      className="cursor-pointer text-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="relative text-[15px] ">
                <button
                  onClick={toggleSessionOpen}
                  className={`${
                    !isSessionSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center sm:w-[250px] text-[#92A7BE] w-full  hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  Select session
                  <span
                    className={`${
                      isSessionOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isSessionOpen && (
                  <div
                    ref={mouseClick}
                    className="absolute z-10 w-full max-h-[200px] mt-1 bg-surface-100  overflow-auto scrollbar-webkit border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingSession ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : isBatchSelected ? (
                      sessions && sessions.length > 0 ? (
                        sessions.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleSessionSelect(option)}
                            className={`px-2 py-1 cursor-pointer`}
                          >
                            <div
                              className={`px-4 py-2 cursor-pointer rounded-lg ${
                                selectedSessionID.includes(option.id)
                                  ? "bg-blue-300 font-semibold text-white"
                                  : "hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold"
                              }`}
                            >
                              {option.session_name}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-center text-dark-300">
                          no session found
                        </div>
                      )
                    ) : (
                      <p className="text-sm text-center text-dark-300">
                        First select the batch
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-4 mt-6">
            <div>
              <button
                className="border border-blue-300 text-blue-300 rounded-lg px-5 py-2.5 hover:bg-mix-400"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                className="bg-blue-300 text-surface-100 rounded-lg px-5 py-2.5 hover:bg-[#2670be]"
                onClick={handleSubmitAnnoucement}
              >
                Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}