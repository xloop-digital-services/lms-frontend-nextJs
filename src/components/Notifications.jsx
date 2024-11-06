"use client";
import React, { useEffect } from "react";
import { FaBell, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useWebSocket from "@/providers/useWebSockets";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";

export default function Notifications() {
  const { userData } = useAuth();
  const userID = userData?.User?.id;
  const router = useRouter();
  const { messages, loading } = useWebSocket(
    `ws://5zrprk8f-8000.uks1.devtunnels.ms/ws/notification/?user_id=${userID}`
  );


  console.log(messages);

  const handleCreateAnnoucement = () => {
    router.push("/announcement");
  };

  return (
    <>
      <div className="flex flex-col p-1 h-80 overflow-y-scroll scrollbar-webkit font-inter">
        <h3 className="font-bold px-2 font-exo">Annoucements</h3>
        {loading && <CircularProgress size={20} />}
        <div className="flex px-4 justify-center items-center">
          <div className="flex justify-center w-12 h-7 items-center rounded-full border border-1 mx-4 border-blue-300 bg-blue-600">
            <FaBell size={20} fill="#03A1D8" />
          </div>
          {messages.map((message) => (
            <div className="flex flex-col">
              <div>
                {message.assessment_type}
              </div>
            </div>
          ))}
        </div>
        <hr className="text-dark-200 mx-4 my-2"></hr>

        <div className="w-full px-4">
          <button
            className="flex gap-2 justify-center rounded-xl py-2 items-center w-full hover:bg-blue-100 hover:text-blue-300"
            onClick={handleCreateAnnoucement}
          >
            <FaPlus />
            <p>New annoucement</p>
          </button>
        </div>
      </div>
    </>
  );
}
