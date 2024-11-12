"use client";
import React, { useEffect, useState } from "react";
import ShortListUserTable from "@/components/ShortlistUserTable";
import UserManagement from "@/components/UserManagement";
import { getAllPrograms } from "@/api/route";
import { useRouter } from "next/navigation";

export default function Page() {
  const [getPrograms, setGetPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const handleGetAllPrograms = async () => {
    // setLoading(true)
    try {
      const response = await getAllPrograms();
      if (response?.data?.status_code === 200) {
        setGetPrograms(response?.data?.data || []);
        setLoading(false);
      }
      if (response?.data?.status_code === 404) {
        setLoading(false);
        //console.log('ab aya error')
      }
    } catch (err) {
      setLoading(false);
      //console.error("error while fetching the programs", err);
    }
  };

  useEffect(() => {
    handleGetAllPrograms();
  }, []);

  return (
    <>
      <UserManagement
        heading="Verified Users"
        program={getPrograms}
        loadingProgram={loading}
        goBack={goBack}
      />
    </>
  );
}
