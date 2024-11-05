"use client";
import { listAllBatches, listSessionsByBatch } from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  const [selectedSession, setSelectedSession] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isSessionSelected, setIsSessionSelected] = useState(false);
  const mouseClick = useRef(null);
  const router = useRouter();

  useClickOutside(mouseClick, () => {
    setIsBatchOpen(false);
    setIsSessionOpen(false);
  });

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
    setSelectedSession(null);
    setIsSessionSelected(false);
  };

  const toggleSessionOpen = () => {
    setIsSessionOpen(true);
  };

  const handleSessionSelect = (option) => {
    setSelectedSession(option.session_name);
    setIsSessionSelected(true);
    setIsSessionOpen(false);
  };

  const handleCancel = () => {
    setTitle("");
    setMessage("");
    setSelectedBatch(null);
    router.push("/dashboard");
  };

  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-16 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{ width: isSidebarOpen ? "86%" : "100%" }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <div className="flex flex-col gap-3 w-full">
          <p className="font-bold text-blue-500 text-xl font-exo">
            Create an Announcement
          </p>
          <div className="w-full">
            <p>Title</p>
            <input
              type="text"
              className="px-4 py-3 border border-dark-300 rounded-xl w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p>Message</p>
            <textarea
              className="px-4 py-3 border border-dark-300 rounded-xl w-full min-h-[100px] max-h-[150px] overflow-auto resize-y scrollbar-webkit outline-none"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <p>Select the batch</p>

            <div className="border border-dark-300 rounded-xl w-full flex items-center justify-between pl-4 pr-2 py-2">
              <p>{selectedBatch}</p>
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
                      isBatchOpen || openBatch
                        ? "rotate-180 duration-300"
                        : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {(isBatchOpen || openBatch) && (
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
          <div>
            <p>Select the session</p>

            <div className="border border-dark-300 rounded-xl w-full flex items-center justify-between pl-4 pr-2 py-2">
              <p>{selectedSession}</p>
              <div className="relative text-[15px] ">
                <button
                  onClick={toggleSessionOpen}
                  className={`${
                    !isSessionSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center sm:w-[250px] text-[#92A7BE] w-full  hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  Select Session
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
                            className="p-2 cursor-pointer "
                          >
                            <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
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
              <button className="bg-blue-300 text-surface-100 rounded-lg px-5 py-2.5 hover:bg-[#2670be]">
                Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
