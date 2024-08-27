"use client";
import React, { useEffect, useState } from "react";
import UserManagement from "@/components/UserManagement";
import DevelopmentTable from "@/components/DevelopmentTable";
import { getAllPrograms } from "@/api/route";

export default function Page() {
  const [getPrograms, setGetPrograms] = useState([]);
  const [programName, setProgramName] = useState([]);

  const handleGetAllPrograms = async () => {
    try {
      const response = await getAllPrograms();
      if (response?.data?.status_code === 200) {
        setGetPrograms(response?.data?.data || []);
      }
      if(response?.data?.status_code === 404){
        console.log('ab aya error')
      }
    } catch (err) {
      console.error("error while fetching the programs", err);
    }
  };

  useEffect(() => {
    handleGetAllPrograms();
  }, []);

  return (
    <>
      <UserManagement heading="User Approval" program={getPrograms} />
    </>
  );
}
